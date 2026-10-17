/** Integration tests - feedback rules and warden dashboard statistics. */
const request = require("supertest");
const db = require("../setup/db");
const app = require("../../server");
const Feedback = require("../../models/Feedback");
const Complaint = require("../../models/Complaint");
const { HOUR, tokenFor, createResident, createWarden, createComplaint } = require("../helpers/factory");
const { record, http } = require("../helpers/recorder");

let resident, other, warden, rTok, oTok, wTok;
const auth = (t) => ({ Authorization: `Bearer ${t}` });
const resolved = (r, extra = {}) =>
  createComplaint(r, { status: "RESOLVED", resolvedAt: new Date(), ...extra });
const post = (id, tok, body) =>
  request(app).post(`/api/complaints/${id}/feedback`).set(auth(tok)).send(body);

beforeAll(db.connect);
afterAll(db.disconnect);
beforeEach(async () => {
  await db.clear();
  resident = await createResident();
  other = await createResident();
  warden = await createWarden();
  rTok = tokenFor(resident);
  oTok = tokenFor(other);
  wTok = tokenFor(warden);
});

describe("Feedback", () => {
  test("TC-28: submit feedback on a resolved complaint", async () => {
    const c = await resolved(resident);
    const res = await post(c._id, rTok, { rating: 4, comment: "Fixed quickly" });
    const flag = (await Complaint.findById(c._id)).feedbackSubmitted;
    record("TC-28", `${http(res)}; rating=${res.body.data?.feedback?.rating}; complaint.feedbackSubmitted=${flag}`);
    expect(res.status).toBe(201);
    expect(res.body.data.feedback.rating).toBe(4);
    expect(flag).toBe(true);
  });

  test("TC-29: feedback on an unresolved complaint is rejected", async () => {
    const c = await createComplaint(resident);
    const res = await post(c._id, rTok, { rating: 5 });
    record("TC-29", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Feedback can only be submitted after the complaint is resolved.");
  });

  test("TC-30: second feedback on the same complaint is rejected", async () => {
    const c = await resolved(resident);
    await post(c._id, rTok, { rating: 4 });
    const res = await post(c._id, rTok, { rating: 2 });
    record("TC-30", `${http(res)}; feedback docs in DB: ${await Feedback.countDocuments()}`);
    expect(res.status).toBe(409);
    expect(await Feedback.countDocuments()).toBe(1);
  });

  test("TC-31: rating outside 1-5 is rejected", async () => {
    const c = await resolved(resident);
    const hi = await post(c._id, rTok, { rating: 7 });
    const lo = await post(c._id, rTok, { rating: 0 });
    record("TC-31", `rating 7 -> ${http(hi)}; rating 0 -> ${http(lo)}`);
    expect(hi.status).toBe(400);
    expect(hi.body.message).toBe("Rating must be between 1 and 5.");
    expect(lo.status).toBe(400);
  });

  test("TC-32: resident cannot give feedback on another resident's complaint", async () => {
    const c = await resolved(other);
    const res = await post(c._id, rTok, { rating: 3 });
    record("TC-32", http(res));
    expect(res.status).toBe(403);
  });

  test("TC-66: comment longer than 500 characters is rejected", async () => {
    const c = await resolved(resident);
    const res = await post(c._id, rTok, { rating: 4, comment: "x".repeat(501) });
    record("TC-66", http(res));
    expect(res.status).toBe(400);
  });

  test("TC-67: warden can read feedback; resident can read own; other resident cannot", async () => {
    const c = await resolved(resident);
    await post(c._id, rTok, { rating: 5, comment: "Great" });
    const url = `/api/complaints/${c._id}/feedback`;
    const w = await request(app).get(url).set(auth(wTok));
    const own = await request(app).get(url).set(auth(rTok));
    const foreign = await request(app).get(url).set(auth(oTok));
    record("TC-67", `warden ${w.status}, owner ${own.status}, other resident ${foreign.status}`);
    expect(w.status).toBe(200);
    expect(own.status).toBe(200);
    expect(foreign.status).toBe(403);
  });

  test("TC-68: warden cannot submit feedback (resident-only)", async () => {
    const c = await resolved(resident);
    const res = await post(c._id, wTok, { rating: 5 });
    record("TC-68", http(res));
    expect(res.status).toBe(403);
  });
});

describe("Warden dashboard statistics", () => {
  test("TC-69: counts, overdue total and average resolution time are correct", async () => {
    await createComplaint(resident, { hoursAgo: 5 });                                   // submitted
    await createComplaint(resident, { hoursAgo: 60 });                                  // submitted + overdue
    await createComplaint(resident, { hoursAgo: 30, status: "UNDER_PROGRESS" });        // under progress
    await resolved(resident, { hoursAgo: 20, resolvedAt: new Date(Date.now() - 10 * HOUR) }); // 10h to resolve
    await resolved(resident, { hoursAgo: 40, resolvedAt: new Date(Date.now() - 10 * HOUR) }); // 30h to resolve
    const res = await request(app).get("/api/dashboard/warden").set(auth(wTok));
    const s = res.body.data?.stats;
    record("TC-69", `${http(res)}; total=${s?.total}, submitted=${s?.submitted}, underProgress=${s?.underProgress}, resolved=${s?.resolved}, overdue=${s?.overdue}, avgResolutionHours=${s?.avgResolutionHours}, resolvedPerDay entries=${s?.resolvedPerDay?.length}`);
    expect(res.status).toBe(200);
    expect(s.total).toBe(5);
    expect(s.submitted).toBe(2);
    expect(s.underProgress).toBe(1);
    expect(s.resolved).toBe(2);
    expect(s.overdue).toBe(1);
    expect(s.avgResolutionHours).toBeCloseTo(20, 0);
    expect(s.resolvedPerDay).toHaveLength(14);
  });

  test("TC-70: dashboard with no complaints returns zeros and null average", async () => {
    const res = await request(app).get("/api/dashboard/warden").set(auth(wTok));
    const s = res.body.data?.stats;
    record("TC-70", `${http(res)}; total=${s?.total}; avgResolutionHours=${s?.avgResolutionHours}`);
    expect(s.total).toBe(0);
    expect(s.avgResolutionHours).toBeNull();
  });

  test("TC-71: resident cannot access the warden dashboard", async () => {
    const res = await request(app).get("/api/dashboard/warden").set(auth(rTok));
    record("TC-71", http(res));
    expect(res.status).toBe(403);
  });
});
