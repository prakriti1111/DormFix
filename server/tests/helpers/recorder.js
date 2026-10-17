/**
 * Records the ACTUAL observed result of each test case so the test report can
 * be generated from real data instead of hand-typed text.
 * Output: tests/evidence/actuals.ndjson (one JSON object per line).
 */
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "..", "evidence");
const file = path.join(dir, "actuals.ndjson");

const record = (id, actual) => {
  fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(file, JSON.stringify({ id, actual }) + "\n");
};

/** Convenience: "HTTP 409 - Email is already registered." */
const http = (res) =>
  `HTTP ${res.status}` + (res.body && res.body.message ? ` - ${res.body.message}` : "");

module.exports = { record, http, file };
