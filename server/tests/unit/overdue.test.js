/** Unit tests - 48-hour overdue rule (utils/overdue.js). No DB required. */
const { computeIsOverdue, OVERDUE_THRESHOLD_MS } = require("../../utils/overdue");
const { record } = require("../helpers/recorder");

const HOUR = 60 * 60 * 1000;
const ago = (h) => new Date(Date.now() - h * HOUR);

describe("Overdue logic (unit)", () => {
  test("TC-25: complaint created 5 hours ago is not overdue", () => {
    const r = computeIsOverdue({ status: "SUBMITTED", createdAt: ago(5) });
    record("TC-25", `isOverdue = ${r}`);
    expect(r).toBe(false);
  });

  test("TC-26: unresolved complaint older than 48 hours is overdue", () => {
    const r = computeIsOverdue({ status: "UNDER_PROGRESS", createdAt: ago(60) });
    record("TC-26", `isOverdue = ${r}`);
    expect(r).toBe(true);
  });

  test("TC-27: resolved complaint older than 48 hours is never overdue", () => {
    const r = computeIsOverdue({ status: "RESOLVED", createdAt: ago(80) });
    record("TC-27", `isOverdue = ${r}`);
    expect(r).toBe(false);
  });

  test("TC-55: boundary - 47h59m not overdue, 48h01m overdue", () => {
    const justUnder = computeIsOverdue({ status: "SUBMITTED", createdAt: ago(47.98) });
    const justOver = computeIsOverdue({ status: "SUBMITTED", createdAt: ago(48.02) });
    record("TC-55", `47.98h -> ${justUnder}; 48.02h -> ${justOver}`);
    expect(justUnder).toBe(false);
    expect(justOver).toBe(true);
  });

  test("TC-56: threshold constant equals 48 hours in milliseconds", () => {
    record("TC-56", `OVERDUE_THRESHOLD_MS = ${OVERDUE_THRESHOLD_MS}`);
    expect(OVERDUE_THRESHOLD_MS).toBe(48 * HOUR);
  });
});
