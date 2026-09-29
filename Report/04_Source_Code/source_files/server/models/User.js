const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["resident", "warden"],
      default: "resident",
      required: true,
    },
    // Resident-only fields (not required for warden)
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true, // allows warden docs without this field
      trim: true,
    },
    roomNumber: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ registrationNumber: 1 });

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    fullName: this.fullName,
    email: this.email,
    role: this.role,
    registrationNumber: this.registrationNumber,
    roomNumber: this.roomNumber,
    createdAt: this.createdAt,
  };
};

module.exports = mongoose.model("User", userSchema);
