// Runs before every test file: test-only environment variables.
// No real credentials are used anywhere in the test suite.
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "test-only-secret-not-for-production";
process.env.JWT_EXPIRES_IN = "1h";
process.env.UPLOAD_DIR = "uploads_test"; // isolated from real uploads/
process.env.CLIENT_ORIGIN = "http://localhost:5173";
