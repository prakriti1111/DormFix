const User = require("../models/User");

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const registerResident = async ({
  fullName,
  registrationNumber,
  roomNumber,
  email,
  password,
}) => {
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new AppError("Email is already registered.", 409);
  }

  const existingRegNo = await User.findOne({ registrationNumber });
  if (existingRegNo) {
    throw new AppError("Registration number is already in use.", 409);
  }

  const user = await User.create({
    fullName,
    registrationNumber,
    roomNumber,
    email: email.toLowerCase(),
    password,
    role: "resident", 
  });

  return user;
};

const login = async (email, password) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select(
    "+password"
  );
  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError("Invalid email or password.", 401);
  }

  return user;
};

module.exports = { registerResident, login, AppError };
