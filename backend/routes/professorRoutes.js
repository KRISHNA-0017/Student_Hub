const express = require("express");
const router = express.Router();
const professorController = require("../controllers/professorController");

// Define routes for all professor operations.
router.route("/").post(professorController.createNewProfessor);
router.route("/list/:department").get(professorController.getProfessorList);
router.route("/approve/:department").get(professorController.getNewProfessors);

// Define routes for specific professor operations based on the student ID.
router
  .route("/:id")
  .get(professorController.getProfessor)
  .patch(professorController.approveProfessor)
  .delete(professorController.deleteProfessor);

module.exports = router;
