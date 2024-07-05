const { mongoose } = require("mongoose");
const Course = require("./../models/Course");
const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");

// @desc Get Courses for each Professor
// @route GET /Course/professor/professorId
// @access Everyone
const getCourses = asyncHandler(async (req, res) => {
  if (!req?.params?.professorId) {
    return res.status(400).json({ message: "Professor ID Missing" });
  }
  const courses = await Course.find({
    professor: req.params.professorId,
  })
    .select("-students")
    .exec();
  if (!courses) {
    return res.status(404).json({
      message: `No Course(s) found`,
    });
  }
  res.json(courses);
});

// @desc Get Courses for each Student
// @route GET /course/student/:studentId
// @access Everyone
const getCoursesStudent = asyncHandler(async (req, res) => {
  if (!req?.params?.studentId) {
    return res.status(400).json({ message: "Student ID Missing" });
  }
  const courses = await Course.aggregate([
    {
      $lookup: {
        from: "professors",
        localField: "professor",
        foreignField: "_id",
        as: "professor",
      },
    },
    {
      $unwind: "$professor",
    },
    {
      $project: {
        students: {
          $in: [new mongoose.Types.ObjectId(req.params.studentId), "$students"],
        },
        semester: 1,
        year: 1,
        course: 1,
        "professor.name": 1,
      },
    },
    {
      $match: { students: true },
    },
  ]);
  if (!courses) {
    return res.status(404).json({
      message: `No Course(s) found`,
    });
  }
  res.json(courses);
});

// @desc Get All Courses
// @route GET /course/
// @access Everyone
const getAllCourses = asyncHandler(async (req, res) => {
  if (!req?.params?.studentId) {
    return res.status(400).json({ message: "Student ID Missing" });
  }

  const courses = await Course.aggregate([
    {
      $lookup: {
        from: "professors",
        localField: "professor",
        foreignField: "_id",
        as: "professor",
      },
    },
    {
      $unwind: "$professor",
    },
    {
      $project: {
        semester: 1,
        year: 1,
        course: 1,
        "professor.name": 1,
        students: 1,
        department: 1,
        joined: {
          $in: [new mongoose.Types.ObjectId(req.params.studentId), "$students"],
        },
      },
    },
  ]);
  if (!courses) {
    return res.status(404).json({
      message: `No Course(s) found`,
    });
  }
  res.json(courses);
});

// @desc Get Students for each course
// @route GET /course/students/:courseId
// @access Private
const getStudentsList = asyncHandler(async (req, res) => {
  if (!req?.params?.courseId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }

  const students = await Course.findById(req.params.courseId)
    .select("students")
    .populate({ path: "students", select: "name" })
    .exec();
  if (!students?.students) {
    return res.status(400).json({ message: "No Students Found" });
  }
  res.json(students.students);
});

// @desc Get Course
// @route GET /Course
// @access Everyone
const getCourse = asyncHandler(async (req, res) => {
  if (!req?.params?.courseId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const course = await Course.findOne({
    _id: req.params.courseId,
  })
    .populate({ path: "professor", select: "name" })
    .populate({ path: "students", select: "name" })
    .exec();
  if (!course) {
    return res.status(404).json({
      message: `No Course(s) found`,
    });
  }
  res.json(course);
});

// @desc Add Course
// @route POST /Course
// @access Private
const addCourse = asyncHandler(async (req, res) => {
  const { department, semester, year, course,  professor } = req.body;

  // Confirm Data
  if (!department || !course || !semester || !year || !students || !professor) {
    console.log("Received request body:", req.body);
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Course.findOne({
    department: req.body.department,
    course: req.body.course,
    students: req.body.students,
    professor: req.body.professor,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Course already exists" });
  }

  const CourseObj = {
    department,
    semester,
    course,
    year,
    students,
    professor,
  };

  // Create and Store New professor
  const record = await Course.create(CourseObj);

  if (record) {
    res.status(201).json({
      message: `New Course ${req.body.course} added `,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// @desc Update Course
// @route PATCH /Course
// @access Private
const updateStudents = asyncHandler(async (req, res) => {
  const { id, students } = req.body;

  // Confirm Data
  if (!id || !students) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Course.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Course doesn't exist" });
  }

  record.students = students;

  const save = await record.save();
  if (save) {
    res.json({ message: "Updated" });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// @desc Delete Course
// @route DELETE /Course
// @access Private
const deleteCourse = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Course ID required" });
  }

  const record = await Course.findById(id).exec();

  if (!record) {
    return res.status(404).json({ message: "Course not found" });
  }

  await record.deleteOne();

  res.json({ message: `${course} deleted` });
});


// ############################################################################ Student update fucntion with Email Function ##########################################################################
// const updateStudents = asyncHandler(async (req, res) => {
//   const { id, students } = req.body;

//   if (!id || !students) {
//     return res.status(400).json({ message: "All fields are required" });
//   }

//   const course = await Course.findById(id).exec();

//   if (!course) {
//     return res.status(404).json({ message: "Course doesn't exist" });
//   }

//   const previousStudents = new Set(course.students.map(String));
//   const updatedStudents = new Set(students.map(String));

//   const newStudents = students.filter(student => !previousStudents.has(student));
//   const droppedStudents = [...previousStudents].filter(student => !updatedStudents.has(student));

//   if (newStudents.length > 0) {
//     await sendEmailToStudents(newStudents, 'registered', course.course);
//   }

//   if (droppedStudents.length > 0) {
//     await sendEmailToStudents(droppedStudents, 'dropped', course.course);
//   }

//   course.students = students;

//   const updated = await course.save();

//   if (updated) {
//     res.json({ message: "Course updated successfully" });
//   } else {
//     res.status(400).json({ message: "Failed to update course" });
//   }
// });

// // Helper function to send email to students
// const sendEmailToStudents = async (studentIds, action, courseName) => {
//   for (const studentId of studentIds) {
//     const student = await Student.findById(studentId);

//     if (student) {
//       const subject = `Course ${action} notification`;
//       const text = `You have ${action} the course: ${courseName}.`;

//       // Define email sending logic here
//       // Example using Nodemailer
//       const transporter = nodemailer.createTransport({
//         // SMTP configuration
//       });
//       const mailOptions = {
//         from: 'your-email@example.com',
//         to: student.email,
//         subject: subject,
//         text: text,
//       };

//       transporter.sendMail(mailOptions, function(error, info) {
//         if (error) {
//           console.log(error);
//         } else {
//           console.log('Email sent: ' + info.response);
//         }
//       });
//     }
// }
// };


module.exports = {
  addCourse,
  getAllCourses,
  getCourses,
  getCoursesStudent,
  getStudentsList,
  getCourse,
  updateStudents,
  deleteCourse,
};
