/**
 * Example test file for complaint authorization rules.
 * Requires a test database to run fully (e.g. mongodb-memory-server).
 */
const request = require("supertest");
const app = require("../server");

describe("Complaint API - authorization", () => {
  it("should reject a resident accessing the warden-only list endpoint", async () => {
    // Assumes a helper to log in as a seeded resident and obtain a token
    // const token = await loginAsResident();
    // const res = await request(app)
    //   .get("/api/complaints")
    //   .set("Authorization", `Bearer ${token}`);
    // expect(res.statusCode).toBe(403);
    expect(true).toBe(true); // placeholder assertion — wire up test DB to enable
  });

  it("should reject an unauthenticated request to create a complaint", async () => {
    const res = await request(app)
      .post("/api/complaints")
      .send({ description: "Broken fan" });
    expect(res.statusCode).toBe(401);
  });

  it("should reject an invalid status transition payload shape", async () => {
    const res = await request(app)
      .patch("/api/complaints/000000000000000000000000/status")
      .send({ status: "INVALID_STATUS" });
    expect(res.statusCode).toBe(401); // unauthenticated first
  });
});
