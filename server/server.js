require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
// const complaintRoutes = require("./routes/complaintRoutes");
// const feedbackRoutes = require("./routes/feedbackRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");

connectDB();

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// app.use(
//   "/uploads",
//   express.static(path.join(__dirname, process.env.UPLOAD_DIR || "uploads"))
// );

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "HostelFix API is running." });
});

app.use("/api/auth", authRoutes);
// app.use("/api/complaints", complaintRoutes);
// app.use("/api/complaints/:id/feedback", feedbackRoutes);
// app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`HostelFix server running on port ${PORT}`);
});

module.exports = app;
