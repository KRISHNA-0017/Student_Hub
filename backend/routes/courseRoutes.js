const express = require("express");
const router = express.Router();
const courseController = require("../controllers/courseController");

// This route uses the addCourse method from the courseController
router.route("/").post(courseController.addCourse);

// This route uses the getAllCourses method from the courseController
router.route("/manage/:studentId").get(courseController.getAllCourses);

router.route("/students/:courseId").get(courseController.getStudentsList);
router.route("/professor/:professorId").get(courseController.getCourses);
router.route("/student/:studentId").get(courseController.getCoursesStudent);

// These routes use getCourse, updateStudents, and deleteCourse methods from the courseController
router
  .route("/:courseId")
  .get(courseController.getCourse)
  .patch(courseController.updateStudents)
  .delete(courseController.deleteCourse);

module.exports = router;
