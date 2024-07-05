const mongoose = require('mongoose');    // Import the mongoose module to interact with the MongoDB database.

// Define an asynchronous function to establish a connection to the MongoDB database.
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://admin:admin@finalproject.38aiohw.mongodb.net/API?retryWrites=true&w=majority'); //  connect to the MongoDB database
    console.log('MongoDB Connected'); // message for successful connection
  } catch (error) {
    console.error('MongoDB connection failed:', error.message); // message for unsuccessful connection
    process.exit(1); // Terminate the Node.js process with a failure status (1) if unable to connect.
  }
};

module.exports = connectDB;