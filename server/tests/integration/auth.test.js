/** Integration tests - authentication (REST API + real database). */
const request = require("supertest");
const jwt = require("jsonwebtoken");
const db = require("../setup/db");
const app = require("../../server");
const User = require("../../models/User");
const { createResident, createWarden, tokenFor } = require("../helpers/factory");
const { record, http } = require("../helpers/recorder");

const valid = {
  fullName: "Test Student",
  registrationNumber: "REG-T-001",
  roomNumber: "T-100",
  email: "student@dormfix.test",
  password: "Test@1234",
};

beforeAll(db.connect);
beforeEach(db.clear);
afterAll(db.disconnect);

describe("Authentication", () => {
  test("TC-01: register a new resident with valid details", async () => {
    const res = await request(app).post("/api/auth/register").send(valid);
    record("TC-01", `${http(res)}; token returned: ${!!res.body.data?.token}; role=${res.body.data?.user?.role}`);
    expect(res.status).toBe(201);
    expect(res.body.data.token).toBeTruthy();
    expect(res.body.data.user.role).toBe("resident");
    expect(res.body.data.user.password).toBeUndefined();
  });

  test("TC-02: register with a duplicate email", async () => {
    await createResident({ email: valid.email });
    const res = await request(app).post("/api/auth/register").send(valid);
    record("TC-02", http(res));
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Email is already registered.");
  });

  test("TC-03: register with a duplicate registration number", async () => {
    await createResident({ registrationNumber: valid.registrationNumber });
    const res = await request(app).post("/api/auth/register").send(valid);
    record("TC-03", http(res));
    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Registration number is already in use.");
  });

  test("TC-04: register with a password shorter than 6 characters", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...valid, password: "123" });
    record("TC-04", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/at least 6 characters/);
  });

  test("TC-05: login with correct credentials", async () => {
    await request(app).post("/api/auth/register").send(valid);
    const res = await request(app).post("/api/auth/login").send({ email: valid.email, password: valid.password });
    record("TC-05", `${http(res)}; token returned: ${!!res.body.data?.token}`);
    expect(res.status).toBe(200);
    expect(res.body.data.token).toBeTruthy();
  });

  test("TC-06: login with an incorrect password", async () => {
    await request(app).post("/api/auth/register").send(valid);
    const res = await request(app).post("/api/auth/login").send({ email: valid.email, password: "WrongPass1" });
    record("TC-06", http(res));
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password.");
  });

  test("TC-07: access a protected route with no token", async () => {
    const res = await request(app).get("/api/auth/me");
    record("TC-07", http(res));
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized. No token provided.");
  });

  test("TC-08: access a protected route with a malformed/invalid token", async () => {
    const res = await request(app).get("/api/auth/me").set("Authorization", "Bearer not.a.jwt");
    record("TC-08", http(res));
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized. Invalid or expired token.");
  });

  test("TC-33: client-supplied role is ignored on registration (no privilege escalation)", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...valid, role: "warden" });
    record("TC-33", `${http(res)}; role assigned = ${res.body.data?.user?.role}`);
    expect(res.status).toBe(201);
    expect(res.body.data.user.role).toBe("resident");
  });

  test("TC-34: register with a missing required field", async () => {
    const { roomNumber, ...incomplete } = valid;
    const res = await request(app).post("/api/auth/register").send(incomplete);
    record("TC-34", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("All fields are required.");
  });

  test("TC-35: register with an invalid email format", async () => {
    const res = await request(app).post("/api/auth/register").send({ ...valid, email: "not-an-email" });
    record("TC-35", http(res));
    expect(res.status).toBe(400);
    expect(res.body.message).toBe("Invalid email format.");
  });

  test("TC-36: login with an unregistered email gives the same generic error", async () => {
    const res = await request(app).post("/api/auth/login").send({ email: "ghost@dormfix.test", password: "Whatever1" });
    record("TC-36", http(res));
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Invalid email or password.");
  });

  test("TC-37: GET /api/auth/me with a valid token returns the user without password", async () => {
    const r = await createResident();
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${tokenFor(r)}`);
    record("TC-37", `${http(res)}; email=${res.body.data?.user?.email}; password field present: ${"password" in (res.body.data?.user || {})}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe(r.email);
    expect(res.body.data.user.password).toBeUndefined();
  });

  test("TC-38: password is stored hashed, never as plain text", async () => {
    await request(app).post("/api/auth/register").send(valid);
    const stored = await User.findOne({ email: valid.email }).select("+password");
    record("TC-38", `stored value starts with "${stored.password.slice(0, 4)}" (bcrypt); equals plaintext: ${stored.password === valid.password}`);
    expect(stored.password).not.toBe(valid.password);
    expect(stored.password).toMatch(/^\$2[aby]\$/);
  });

  test("TC-39: seeded warden can log in and receives role 'warden'", async () => {
    const w = await createWarden({ email: "warden@dormfix.test" });
    const res = await request(app).post("/api/auth/login").send({ email: w.email, password: "Warden@123" });
    record("TC-39", `${http(res)}; role=${res.body.data?.user?.role}`);
    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe("warden");
  });

  test("TC-40: unknown API route returns 404 in the standard error shape", async () => {
    const res = await request(app).get("/api/does-not-exist");
    record("TC-40", http(res));
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test("TC-61: token for a deleted user is rejected", async () => {
    const r = await createResident();
    const token = tokenFor(r);
    await User.deleteOne({ _id: r._id });
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);
    record("TC-61", http(res));
    expect(res.status).toBe(401);
  });

  test("TC-62: an expired token is rejected", async () => {
    const r = await createResident();
    const expired = jwt.sign({ id: r._id, role: r.role }, process.env.JWT_SECRET, { expiresIn: -10 });
    const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${expired}`);
    record("TC-62", http(res));
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized. Invalid or expired token.");
  });
});
