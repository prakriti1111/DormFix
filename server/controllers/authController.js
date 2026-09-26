const asyncHandler = require("../utils/asyncHandler");
const { success, error } = require("../utils/apiResponse");
const authService = require("../services/authService");
const generateToken = require("../utils/generateToken");

// POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { fullName, registrationNumber, roomNumber, email, password } = req.body;

  if (!fullName || !registrationNumber || !roomNumber || !email || !password) {
    return error(res, 400, "All fields are required.");
  }
  if (password.length < 6) {
    return error(res, 400, "Password must be at least 6 characters.");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return error(res, 400, "Invalid email format.");
  }

  const user = await authService.registerResident({
    fullName,
    registrationNumber,
    roomNumber,
    email,
    password,
  });

  const token = generateToken(user);
  return success(res, 201, "Registration successful.", {
    token,
    user: user.toSafeObject(),
  });
});

// POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return error(res, 400, "Email and password are required.");
  }

  const user = await authService.login(email, password);
  const token = generateToken(user);

  return success(res, 200, "Login successful.", {
    token,
    user: user.toSafeObject(),
  });
});

// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  return success(res, 200, "Current user fetched.", {
    user: req.user.toSafeObject(),
  });
});

module.exports = { register, login, getMe };
