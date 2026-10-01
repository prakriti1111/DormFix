import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const initialForm = {
  fullName: "",
  registrationNumber: "",
  roomNumber: "",
  email: "",
  password: "",
};

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);

    try {
      await register(form);
      navigate("/resident/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="auth-box card">
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "#dfb6b2",
            color: "#190019",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            fontSize: "1.15rem",
            marginBottom: "1rem",
          }}
        >
          D
        </div>

        <div
          style={{
            color: "#b895a8",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            fontWeight: 800,
            marginBottom: "0.4rem",
          }}
        >
          Resident Account
        </div>

        <h2>Create your account</h2>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={form.fullName}
              onChange={handleChange("fullName")}
              required
            />
          </div>

          <div className="form-group">
            <label>Registration Number</label>

            <input
              type="text"
              placeholder="Enter registration number"
              value={form.registrationNumber}
              onChange={handleChange("registrationNumber")}
              required
            />
          </div>

          <div className="form-group">
            <label>Room Number</label>

            <input
              type="text"
              placeholder="e.g. A-101"
              value={form.roomNumber}
              onChange={handleChange("roomNumber")}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange("email")}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Minimum 6 characters"
              value={form.password}
              onChange={handleChange("password")}
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ width: "100%" }}
          >
            {submitting ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div className="auth-switch">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;