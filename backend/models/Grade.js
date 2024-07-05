const mongoose = require("mongoose");

// Grades of Students schema
const gradeSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  marks: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
      },
      name: String,
      test: {
        type: Number,
        required: true,
      },
      seminar: {
        type: Number,
        required: true,
      },
      assignment: {
        type: Number,
        required: true,
      },
      attendance: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("Grade", gradeSchema);
