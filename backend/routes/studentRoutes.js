const express = require("express");
const router = express.Router();
const studentController = require("./../controllers/studentController");

// Define routes for specific student operations based on the student ID.
router
  .route("/:id")
  .get(studentController.getStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

// Define routes for all student operations.
router
  .route("/")
  .get(studentController.getAllStudents)
  .post(studentController.createNewStudent);

module.exports = router;
