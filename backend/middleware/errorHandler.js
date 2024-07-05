const { logEvents } = require("./logger");

// error handling middleware
const errorHandler = (err, req, res, next) => {
  // Log the error details including the request method, URL, and origin
  logEvents(
    `${err.name}:${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log"
  );
  console.log(err.stack);

  const status = res.statusCode ? res.statusCode : 500; // Determine the status code - use the existing status code or default to 500 (server error)

  res.json({ message: err.message });
};

// Export the errorHandler middleware
module.exports = errorHandler;
