const { error } = require("../utils/apiResponse");

/**
 * Restricts a route to one or more roles.
 * Usage: authorize("warden") or authorize("resident", "warden")
 * Must be used AFTER the `protect` middleware.
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return error(res, 401, "Not authorized.");
    }
    if (!allowedRoles.includes(req.user.role)) {
      return error(
        res,
        403,
        `Forbidden. Role '${req.user.role}' cannot access this resource.`
      );
    }
    next();
  };
};

module.exports = { authorize };
