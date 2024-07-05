const { v4: uuid } = require("uuid");
const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

// Current date for logging
const date = new Date();
const options = {
  year: "numeric",
  month: "numeric",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
};

// Async function to log events to a file
const logEvents = async (message, logFileName) => {
  // Format the date and time for the log
  const dateTime = new Intl.DateTimeFormat("en-GB", options).format(date);
  const logItem = dateTime + "\t" + uuid() + "\t" + message + "\n";

  try {
    // Check if logs directory exists, create it if it doesn't
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    // Append the log item to the specified log file
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  // Log the HTTP method, URL, and origin of the request
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method}\t${req.path}`);
  next();
};

module.exports = { logEvents, logger };
