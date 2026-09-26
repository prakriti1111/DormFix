const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { error } = require("../utils/apiResponse");


const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return error(res, 401, "Not authorized. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return error(res, 401, "Not authorized. Invalid or expired token.");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return error(res, 401, "Not authorized. User no longer exists.");
    }

    req.user = user; 
    next();
  } catch (err) {
    return error(res, 500, "Authentication error.");
  }
};

module.exports = { protect };
