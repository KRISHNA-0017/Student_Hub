const express = require("express");
const router = express.Router();
const notesController = require("./../controllers/notesController");


// These routes use getNote, updateNotes, and deleteNotes methods from the notesController
router.route("/:noteId")
router
  .route("/:noteId")
  .get(notesController.getNote)
  .patch(notesController.updateNotes)
  .delete(notesController.deleteNotes);

// These routes use getNotes and addNotes methods from the notesController
router
  .route("/course/:courseId")
  .get(notesController.getNotes)
  .post(notesController.addNotes);

module.exports = router;
