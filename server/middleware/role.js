const { error } = require("../utils/apiResponse");


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
