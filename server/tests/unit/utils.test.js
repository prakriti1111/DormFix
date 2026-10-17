/** Unit tests - token generation, role middleware, response helpers. */
const jwt = require("jsonwebtoken");
const generateToken = require("../../utils/generateToken");
const { authorize } = require("../../middleware/role");
const { success, error } = require("../../utils/apiResponse");
const { record } = require("../helpers/recorder");

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Utilities (unit)", () => {
  test("TC-57: JWT contains user id and role and an expiry", () => {
    const token = generateToken({ _id: "abc123", role: "resident" });
    const d = jwt.verify(token, process.env.JWT_SECRET);
    record("TC-57", `payload keys: ${Object.keys(d).join(", ")}; role=${d.role}`);
    expect(d.id).toBe("abc123");
    expect(d.role).toBe("resident");
    expect(d.exp).toBeGreaterThan(d.iat);
  });

  test("TC-58: authorize() blocks a role that is not allowed (403)", () => {
    const res = mockRes();
    const next = jest.fn();
    authorize("warden")({ user: { role: "resident" } }, res, next);
    record("TC-58", `status ${res.status.mock.calls[0][0]}; next called: ${next.mock.calls.length > 0}`);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("TC-59: authorize() allows a permitted role and calls next()", () => {
    const res = mockRes();
    const next = jest.fn();
    authorize("warden")({ user: { role: "warden" } }, res, next);
    record("TC-59", `next called: ${next.mock.calls.length > 0}`);
    expect(next).toHaveBeenCalled();
  });

  test("TC-60: success()/error() helpers return the standard response shape", () => {
    const a = mockRes();
    success(a, 201, "ok", { x: 1 });
    const b = mockRes();
    error(b, 400, "bad", ["e1"]);
    record("TC-60", `success -> ${JSON.stringify(a.json.mock.calls[0][0])}; error -> ${JSON.stringify(b.json.mock.calls[0][0])}`);
    expect(a.json.mock.calls[0][0]).toEqual({ success: true, message: "ok", data: { x: 1 } });
    expect(b.json.mock.calls[0][0]).toEqual({ success: false, message: "bad", errors: ["e1"] });
  });
});
