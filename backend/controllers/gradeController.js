const { default: mongoose } = require("mongoose");
const Grade = require("../models/Grade");
const asyncHandler = require("express-async-handler");


// Retrieve grade results based on course ID
const getGrade = asyncHandler(async (req, res) => {
  // Validate if course ID is provided
  if (!req?.params?.course) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }

  // Fetch grade result for the specified course
  const grade = await Grade.findOne({
    course: req.params.course,
  }).exec();

  // Handle case where no records are found
  if (!grade) {
    return res.status(404).json({
      message: "No Existing Record(s) found. Add New Record.",
    });
  }
  res.json(grade);
});

// Retrieve grade results for a specific student
const getGradeStudent = asyncHandler(async (req, res) => {
  if (!req?.params?.studentId) {  // Validate student ID parameter
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }

  // Perform aggregation to fetch grade marks of a student
  const grade = await Grade.aggregate([
    {
      $lookup: {
        from: "course",
        localField: "course",
        foreignField: "_id",
        as: "course",
      },
    },
    {
      $unwind: "$course",
    },
    {
      $project: {
        marks: {
          $filter: {
            input: "$marks",
            as: "mark",
            cond: {
              $eq: [
                "$$mark._id",
                new mongoose.Types.ObjectId(req.params.studentId),
              ],
            },
          },
        },
        "course.course": 1,
      },
    },
    {
      $unwind: "$marks",
    },
  ]);
  if (!grade.length) {
    return res.status(404).json({
      message: "No Records Found.",
    });
  }
  res.json(grade);  // Return the fetched grade results for the student
});

// Add new grade record
const addGrade = asyncHandler(async (req, res) => {
  const { course, marks } = req.body;

  // Confirm all required data is present
  if (!course || !marks) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }
  // Check for Duplicates
  const duplicate = await Grade.findOne({
    course: req.params.course,
  })
    .lean()
    .exec();
  if (duplicate) {
    return res.status(409).json({ message: "Grade record already exists" });
  }

  const GradeObj = {
    course,
    marks,
  };
  // Create and Store New professor
  const record = await Grade.create(GradeObj);
  if (record) {
    res.status(201).json({
      message: `Grade Record  Added`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// upload marks
const updateGrade = asyncHandler(async (req, res) => {
  const { id, course, marks } = req.body;

  // Confirm Data
  if (!id || !course || !marks) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Grade.findById(id).exec();
  if (!record) {
    return res.status(404).json({ message: "Grade record doesn't exist" });
  }

  // Check for duplicate
  const duplicate = await Grade.findOne({
    course: req.params.course,
  })
    .lean()
    .exec();

  // Allow Updates to original
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate Username" });
  }
  record.course = course;
  record.marks = marks;
  const save = await record.save();
  if (save) {
    res.json({
      message: ` Grade Record Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// delete imarks
const deleteGrade = asyncHandler(async (req, res) => {
  const id = req.params.course;

  if (!id) {
    return res.status(400).json({ message: "Grade ID required" });
  }

  const record = await Grade.findById(id).exec();
  if (!record) {
    return res.status(404).json({ message: "Grade Record not found" });
  }

  await record.deleteOne();
  res.json({
    message: `Grade Record deleted`,
  });
});

module.exports = {
  getGrade,
  getGradeStudent,
  addGrade,
  updateGrade,
  deleteGrade,
};
