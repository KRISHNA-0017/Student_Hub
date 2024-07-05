const mongoose = require('mongoose');

// Define the schema for the user model
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true }
});

userSchema.pre('save', async function(next) {
  // Continue with the save operation
  next();
});

// This model will interact with the 'users' collection in the MongoDB database
const User = mongoose.model('User', userSchema);
module.exports = User;
