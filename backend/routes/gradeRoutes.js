const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/gradeController");


// get result of every course
router.route("/student/:studentId").get(gradeController.getGradeStudent);

// Routes for a specific course
router
  .route("/:course")
  .get(gradeController.getGrade)
  .post(gradeController.addGrade)
  .patch(gradeController.updateGrade)
  .delete(gradeController.deleteGrade);

module.exports = router;
