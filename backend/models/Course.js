const mongoose = require("mongoose");

// Individual Course in a Course
const courseSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  course: {
    type: String,
    required: true,
  },
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: [],
    },
  ],
  professor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Professor",
  },
});

module.exports = mongoose.model("Course", courseSchema);
