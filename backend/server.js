require("dotenv").config();
const express = require("express");
const app = express();
const { logger, logEvents } = require("./middleware/logger");
const errorHandler = require("./middleware/errorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const connectDB = require("./config/dbConn");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3500; // Sets the port number from environment variables or defaults to 3500

connectDB();  // Calls the function to connect to the database

app.use(logger); // Uses the logger middleware for logging requests

app.use(cors(corsOptions)); // Applies CORS middleware with the specified options

app.use(express.json()); // Parses incoming requests with JSON payloads

app.use(cookieParser()); // Uses cookie-parser middleware to parse cookies

app.use("/", express.static("public"));
``;

// Registers various routes with their respective route handlers
app.use("/", require("./routes/root"));
app.use("/auth", require("./routes/authRoutes"));
app.use("/course", require("./routes/paperRoutes"));
app.use("/notes", require("./routes/notesRoutes"));
app.use("/grade", require("./routes/gradeRoutes"));
app.use("/attendance", require("./routes/attendanceRoutes"));
app.use("/time_schedule", require("./routes/timeScheduleRoutes"));
app.use("/professor", require("./routes/professorRoutes"));
app.use("/student", require("./routes/studentRoutes"));


// Catches all unmatched requests and sends a 404 response
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("json")) {
    res.json({ message: "404 Not Found", details: "No paths found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);


// Once the MongoDB connection is open, starts the server
mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));
});

// Logs any MongoDB connection errors
mongoose.connection.on("error", (err) => {
  console.log(err);
  logEvents(
    `${err.no}:${err.code}\t${err.syscall}\t${err.hostname}`,
    "mongoErrLog.log"
  );
});

// Catches uncaught exceptions in the app

mongoose.connection.on("uncaughtException", function (err) {
  console.log(err);
});
