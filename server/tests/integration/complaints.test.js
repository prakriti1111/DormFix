/** Integration tests - authorization + complaint management. */
const request = require("supertest");
const db = require("../setup/db");
const app = require("../../server");
const Complaint = require("../../models/Complaint");
const {
  HOUR, tokenFor, createResident, createWarden, createComplaint, PNG_1x1,
} = require("../helpers/factory");
const { record, http } = require("../helpers/recorder");

let resident, other, warden, rTok, oTok, wTok;
const auth = (t) => ({ Authorization: `Bearer ${t}` });

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

describe("Authorization", () => {
  test("TC-10: resident cannot access the warden-only complaint list", async () => {
    const res = await request(app).get("/api/complaints").set(auth(rTok));
    record("TC-10", http(res));
    expect(res.status).toBe(403);
  });

  test("TC-11: resident cannot view another resident's complaint", async () => {
    const c = await createComplaint(other);
    const res = await request(app).get(`/api/complaints/${c._id}`).set(auth(rTok));
    record("TC-11", http(res));
    expect(res.status).toBe(403);
  });

  test("TC-12: resident cannot update complaint status", async () => {
    const c = await createComplaint(resident);
    const res = await request(app).patch(`/api/complaints/${c._id}/status`).set(auth(rTok)).send({ status: "RESOLVED" });
    record("TC-12", http(res));
    expect(res.status).toBe(403);
    expect((await Complaint.findById(c._id)).status).toBe("SUBMITTED");
  });

  test("TC-13: resident cannot reorder complaints", async () => {
    const c = await createComplaint(resident);
    const res = await request(app).patch("/api/complaints/reorder").set(auth(rTok)).send({ complaintId: c._id, direction: "up" });
    record("TC-13", http(res));
    expect(res.status).toBe(403);
  });

  test("TC-14: warden can list all complaints", async () => {
    await createComplaint(resident);
    await createComplaint(other);
    const res = await request(app).get("/api/complaints").set(auth(wTok));
    record("TC-14", `${http(res)}; complaints returned: ${res.body.data?.complaints?.length}`);
    expect(res.status).toBe(200);
    expect(res.body.data.complaints).toHaveLength(2);
  });

  test("TC-43: warden cannot submit a complaint (resident-only)", async () => {
    const res = await request(app).post("/api/complaints").set(auth(wTok)).send({ description: "Warden should not file this" });
    record("TC-43", http(res));
    expect(res.status).toBe(403);
  });

  test("TC-63: unauthenticated request to create a complaint is rejected", async () => {
    const res = await request(app).post("/api/complaints").send({ description: "No token supplied" });
    record("TC-63", http(res));
    expect(res.status).toBe(401);
  });
});

describe("Complaint submission", () => {
  test("TC-15: submit a valid complaint without an image", async () => {
    const res = await request(app).post("/api/complaints").set(auth(rTok)).field("description", "Ceiling fan is making a loud noise");
    const c = res.body.data?.complaint;
    record("TC-15", `${http(res)}; status=${c?.status}; complaintId=${c?.complaintId}; imagePath=${c?.imagePath}`);
    expect(res.status).toBe(201);
    expect(c.status).toBe("SUBMITTED");
    expect(c.complaintId).toMatch(/^HF-\d{4}$/);
    expect(c.imagePath).toBeNull();
  });

  test("TC-16: submit a complaint with a valid image", async () => {
    const res = await request(app).post("/api/complaints").set(auth(rTok))
      .field("description", "Window glass is cracked")
      .attach("image", PNG_1x1, { filename: "crack.png", contentType: "image/png" });
    const c = res.body.data?.complaint;
    record("TC-16", `${http(res)}; imagePath=${c?.imagePath}`);
    expect(res.status).toBe(201);
    expect(c.imagePath).toMatch(/^\/uploads\/.+\.png$/);
  });

  test("TC-17: description shorter than 5 characters is rejected", async () => {
    const res = await request(app).post("/api/complaints").set(auth(rTok)).field("description", "Hi");
    record("TC-17", http(res));
    expect(res.status).toBe(400);
    expect(await Complaint.countDocuments()).toBe(0);
  });

  test("TC-18: image larger than 5 MB is rejected", async () => {
    const big = Buffer.alloc(5 * 1024 * 1024 + 1024, 1);
    const res = await request(app).post("/api/complaints").set(auth(rTok))
      .field("description", "Photo is too large for upload")
      .attach("image", big, { filename: "big.jpg", contentType: "image/jpeg" });
    record("TC-18", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Image file is too large.");
  });

  test("TC-19: unsupported file type (PDF) is rejected", async () => {
    const res = await request(app).post("/api/complaints").set(auth(rTok))
      .field("description", "Attaching a pdf by mistake")
      .attach("image", Buffer.from("%PDF-1.4 test"), { filename: "doc.pdf", contentType: "application/pdf" });
    record("TC-19", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid file type/);
  });

  test("TC-41: complaint IDs are sequential (HF-0001, HF-0002)", async () => {
    const a = await request(app).post("/api/complaints").set(auth(rTok)).field("description", "First complaint here");
    const b = await request(app).post("/api/complaints").set(auth(oTok)).field("description", "Second complaint here");
    record("TC-41", `${a.body.data?.complaint?.complaintId}, ${b.body.data?.complaint?.complaintId}`);
    expect(a.body.data.complaint.complaintId).toBe("HF-0001");
    expect(b.body.data.complaint.complaintId).toBe("HF-0002");
  });

  test("TC-42: resident identity comes from the profile, not the request body", async () => {
    const res = await request(app).post("/api/complaints").set(auth(rTok))
      .field("description", "Trying to spoof identity")
      .field("residentName", "Hacker").field("roomNumber", "Z-999").field("status", "RESOLVED");
    const c = res.body.data?.complaint;
    record("TC-42", `${http(res)}; residentName=${c?.residentName}; roomNumber=${c?.roomNumber}; status=${c?.status}`);
    expect(c.residentName).toBe(resident.fullName);
    expect(c.roomNumber).toBe(resident.roomNumber);
    expect(c.status).toBe("SUBMITTED");
  });
});

describe("Complaint retrieval", () => {
  test("TC-20: resident sees only their own complaint history", async () => {
    await createComplaint(resident);
    await createComplaint(resident);
    await createComplaint(other);
    const res = await request(app).get("/api/complaints/my").set(auth(rTok));
    const ids = res.body.data.complaints.map((c) => String(c.residentId));
    record("TC-20", `${http(res)}; returned ${ids.length}, all own: ${ids.every((i) => i === String(resident._id))}`);
    expect(res.status).toBe(200);
    expect(ids).toHaveLength(2);
    expect(ids.every((i) => i === String(resident._id))).toBe(true);
  });

  test("TC-44: warden filters by status", async () => {
    await createComplaint(resident, { status: "SUBMITTED" });
    await createComplaint(resident, { status: "UNDER_PROGRESS" });
    const res = await request(app).get("/api/complaints?status=UNDER_PROGRESS").set(auth(wTok));
    record("TC-44", `${http(res)}; returned ${res.body.data?.complaints?.length}`);
    expect(res.body.data.complaints).toHaveLength(1);
    expect(res.body.data.complaints[0].status).toBe("UNDER_PROGRESS");
  });

  test("TC-45: warden filters overdue complaints only", async () => {
    await createComplaint(resident, { hoursAgo: 2 });
    await createComplaint(resident, { hoursAgo: 60 });
    await createComplaint(resident, { hoursAgo: 90, status: "RESOLVED", resolvedAt: new Date() });
    const res = await request(app).get("/api/complaints?overdue=true").set(auth(wTok));
    record("TC-45", `${http(res)}; overdue returned ${res.body.data?.complaints?.length}`);
    expect(res.body.data.complaints).toHaveLength(1);
    expect(res.body.data.complaints[0].isOverdue).toBe(true);
  });

  test("TC-46: warden filters by room number", async () => {
    await createComplaint(resident);
    await createComplaint(other);
    const res = await request(app).get(`/api/complaints?roomNumber=${encodeURIComponent(other.roomNumber)}`).set(auth(wTok));
    record("TC-46", `${http(res)}; returned ${res.body.data?.complaints?.length}`);
    expect(res.body.data.complaints).toHaveLength(1);
    expect(res.body.data.complaints[0].roomNumber).toBe(other.roomNumber);
  });

  test("TC-47: invalid status filter is rejected", async () => {
    const res = await request(app).get("/api/complaints?status=BOGUS").set(auth(wTok));
    record("TC-47", http(res));
    expect(res.status).toBe(400);
  });

  test("TC-48: sorting by oldest / newest orders by creation time", async () => {
    const old = await createComplaint(resident, { hoursAgo: 10 });
    const mid = await createComplaint(resident, { hoursAgo: 5 });
    const nw = await createComplaint(resident, { hoursAgo: 1 });
    const o = await request(app).get("/api/complaints?sortBy=oldest").set(auth(wTok));
    const n = await request(app).get("/api/complaints?sortBy=newest").set(auth(wTok));
    const oIds = o.body.data.complaints.map((c) => c._id);
    const nIds = n.body.data.complaints.map((c) => c._id);
    record("TC-48", `oldest-first order correct: ${oIds[0] === String(old._id)}; newest-first order correct: ${nIds[0] === String(nw._id)}`);
    expect(oIds).toEqual([old, mid, nw].map((c) => String(c._id)));
    expect(nIds).toEqual([nw, mid, old].map((c) => String(c._id)));
  });

  test("TC-50: malformed complaint ID returns 400", async () => {
    const res = await request(app).get("/api/complaints/not-an-id").set(auth(wTok));
    record("TC-50", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid ID format.");
  });

  test("TC-51: well-formed but non-existent complaint ID returns 404", async () => {
    const res = await request(app).get("/api/complaints/000000000000000000000000").set(auth(wTok));
    record("TC-51", http(res));
    expect(res.status).toBe(404);
  });

  test("TC-64: overdue flag is recalculated and persisted when complaints are read", async () => {
    const c = await createComplaint(resident, { hoursAgo: 70, isOverdue: false });
    const res = await request(app).get("/api/complaints/my").set(auth(rTok));
    const persisted = (await Complaint.findById(c._id)).isOverdue;
    record("TC-64", `API isOverdue=${res.body.data.complaints[0].isOverdue}; persisted=${persisted}`);
    expect(res.body.data.complaints[0].isOverdue).toBe(true);
    expect(persisted).toBe(true);
  });
});

describe("Status workflow and ordering", () => {
  const patch = (id, status, tok = wTok) =>
    request(app).patch(`/api/complaints/${id}/status`).set(auth(tok)).send({ status });

  test("TC-21: SUBMITTED -> UNDER_PROGRESS", async () => {
    const c = await createComplaint(resident);
    const res = await patch(c._id, "UNDER_PROGRESS");
    record("TC-21", `${http(res)}; status=${res.body.data?.complaint?.status}`);
    expect(res.status).toBe(200);
    expect(res.body.data.complaint.status).toBe("UNDER_PROGRESS");
  });

  test("TC-22: UNDER_PROGRESS -> RESOLVED sets resolvedAt and clears overdue", async () => {
    const c = await createComplaint(resident, { status: "UNDER_PROGRESS", hoursAgo: 60, isOverdue: true });
    const res = await patch(c._id, "RESOLVED");
    const d = res.body.data?.complaint;
    record("TC-22", `${http(res)}; status=${d?.status}; resolvedAt set=${!!d?.resolvedAt}; isOverdue=${d?.isOverdue}`);
    expect(res.status).toBe(200);
    expect(d.status).toBe("RESOLVED");
    expect(d.resolvedAt).toBeTruthy();
    expect(d.isOverdue).toBe(false);
  });

  test("TC-23: RESOLVED -> SUBMITTED is rejected (terminal state)", async () => {
    const c = await createComplaint(resident, { status: "RESOLVED", resolvedAt: new Date() });
    const res = await patch(c._id, "SUBMITTED");
    record("TC-23", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/Invalid status transition/);
  });

  test("TC-52: SUBMITTED -> RESOLVED directly is allowed (SRS BR-05)", async () => {
    const c = await createComplaint(resident);
    const res = await patch(c._id, "RESOLVED");
    record("TC-52", `${http(res)}; status=${res.body.data?.complaint?.status}`);
    expect(res.status).toBe(200);
  });

  test("TC-49: unknown status value in the request is rejected", async () => {
    const c = await createComplaint(resident);
    const res = await patch(c._id, "DONE");
    record("TC-49", http(res));
    expect(res.status).toBe(400);
  });

  test("TC-65: UNDER_PROGRESS -> SUBMITTED (backwards) is rejected", async () => {
    const c = await createComplaint(resident, { status: "UNDER_PROGRESS" });
    const res = await patch(c._id, "SUBMITTED");
    record("TC-65", http(res));
    expect(res.status).toBe(400);
  });

  test("TC-24: warden moves a complaint up (priorityOrder swapped with neighbour)", async () => {
    const a = await createComplaint(resident, { hoursAgo: 3 });
    const b = await createComplaint(resident, { hoursAgo: 2 });
    const c = await createComplaint(resident, { hoursAgo: 1 }); // highest priority
    const before = { a: a.priorityOrder, b: b.priorityOrder };
    const res = await request(app).patch("/api/complaints/reorder").set(auth(wTok)).send({ complaintId: a._id, direction: "up" });
    const aNow = await Complaint.findById(a._id);
    const bNow = await Complaint.findById(b._id);
    record("TC-24", `${http(res)}; a<->b swapped: ${aNow.priorityOrder === before.b && bNow.priorityOrder === before.a}`);
    expect(res.status).toBe(200);
    expect(aNow.priorityOrder).toBe(before.b);
    expect(bNow.priorityOrder).toBe(before.a);
    expect((await Complaint.findById(c._id)).priorityOrder).toBe(c.priorityOrder);
  });

  test("TC-53: moving the top complaint up is a no-op", async () => {
    const a = await createComplaint(resident, { hoursAgo: 2 });
    const top = await createComplaint(resident, { hoursAgo: 1 });
    const res = await request(app).patch("/api/complaints/reorder").set(auth(wTok)).send({ complaintId: top._id, direction: "up" });
    const topNow = await Complaint.findById(top._id);
    record("TC-53", `${http(res)}; priorityOrder unchanged: ${topNow.priorityOrder === top.priorityOrder}`);
    expect(res.status).toBe(200);
    expect(topNow.priorityOrder).toBe(top.priorityOrder);
    expect((await Complaint.findById(a._id)).priorityOrder).toBe(a.priorityOrder);
  });

  test("TC-54: reorder with an invalid direction is rejected", async () => {
    const a = await createComplaint(resident);
    const res = await request(app).patch("/api/complaints/reorder").set(auth(wTok)).send({ complaintId: a._id, direction: "sideways" });
    record("TC-54", http(res));
    expect(res.status).toBe(400);
  });
});
