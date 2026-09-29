/**
 * Example test file demonstrating the testing-ready structure required
 * for the SEPM submission. Requires a running/mocked MongoDB instance
 * (e.g. mongodb-memory-server) to execute fully.
 *
 * Run with: npm test  (after adding a test DB setup of your choice)
 */
const request = require("supertest");
const app = require("../server");

describe("Auth API", () => {
  const resident = {
    fullName: "Test Student",
    registrationNumber: "REGTEST001",
    roomNumber: "T-100",
    email: "teststudent@hostelfix.edu",
    password: "Test@1234",
  };

  it("should register a new resident", async () => {
    const res = await request(app).post("/api/auth/register").send(resident);
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.role).toBe("resident");
  });

  it("should reject duplicate registration number", async () => {
    await request(app).post("/api/auth/register").send(resident);
    const res = await request(app).post("/api/auth/register").send(resident);
    expect(res.statusCode).toBe(409);
  });

  it("should reject invalid login credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nouser@hostelfix.edu", password: "wrongpass" });
    expect(res.statusCode).toBe(401);
  });

  it("should reject unauthenticated access to /api/auth/me", async () => {
    const res = await request(app).get("/api/auth/me");
    expect(res.statusCode).toBe(401);
  });
});
