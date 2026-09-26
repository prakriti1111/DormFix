const multer = require("multer");
const { error } = require("../utils/apiResponse");


const notFound = (req, res, next) => {
  error(res, 404, `Route not found: ${req.originalUrl}`);
};


const errorHandler = (err, req, res, next) => {
  console.error(err); 

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return error(res, 400, "Image file is too large.");
    }
    return error(res, 400, `Upload error: ${err.message}`);
  }

  if (err.message && err.message.includes("Invalid file type")) {
    return error(res, 400, err.message);
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return error(res, 400, "Validation failed.", messages);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern || {})[0] || "field";
    return error(res, 409, `${field} already exists.`);
  }

  if (err.name === "CastError") {
    return error(res, 400, "Invalid ID format.");
  }

  const statusCode = err.statusCode && err.statusCode >= 400 ? err.statusCode : 500;
  return error(
    res,
    statusCode,
    statusCode === 500 ? "Internal server error." : err.message
  );
};

module.exports = { notFound, errorHandler };
