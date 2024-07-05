const allowedOrigins = require("./allowedOrigins");

// Define the CORS (Cross-Origin Resource Sharing) options.
const corsOptions = {
  origin: (origin, callback) => {   // The 'origin' function is used to dynamically check if the incoming request's
    // If the origin is found in the allowed list, or if the request is not
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed by CORS"));
    }
  },
  credentials: true,    // Setting 'credentials' to true allows cookies and other credentials to be sent
  optionsSuccessStatus: 200,  // The 'optionsSuccessStatus' is set to 200 to avoid legacy browser issues
};

module.exports = corsOptions;
