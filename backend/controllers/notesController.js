const Notes = require("./../models/Notes");
const asyncHandler = require("express-async-handler");

// Retrieves all notes for a specific course.
const getNotes = async (req, res) => {
  if (!req?.params?.courseId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const notes = await Notes.find({
    course: req.params.courseId,
  }).exec();
  if (!notes) {
    return res.status(404).json({
      message: `No Notes found for ${req.params.course}`,
    });
  }
  res.json(notes);
};

// Get Notes for each Course
const getNote = async (req, res) => {
  if (!req?.params?.noteId) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Params Missing" });
  }
  const Note = await Notes.findById(req.params.noteId).exec();
  if (!Note) {
    return res.status(404).json({
      message: "Note Not Found",
    });
  }
  res.json(Note);
};

// Add Notes
const addNotes = asyncHandler(async (req, res) => {
  const { course, title, body } = req.body;

  // Confirm Data
  if (!course || !title || !body) {
    return res
      .status(400)
      .json({ message: "Incomplete Request: Fields Missing" });
  }

  // Check for Duplicates
  const duplicate = await Notes.findOne({
    course: req.params.course,
    title: req.params.title,
    body: req.params.body,
  })
    .lean()
    .exec();

  if (duplicate) {
    return res.status(409).json({ message: "Note already exists" });
  }

  const NotesObj = {
    course,
    title,
    body,
  };

  // Create and Store New professor
  const record = await Notes.create(NotesObj);

  if (record) {
    res.status(201).json({
      message: `Note Added Successfully`,
    });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// Update Notes
const updateNotes = asyncHandler(async (req, res) => {
  const { id, course, title, body } = req.body;

  // Confirm Data
  if (!course || !title || !body) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find Record
  const record = await Notes.findById(req.params.noteId).exec();

  if (!record) {
    return res.status(404).json({ message: "Note doesn't exist" });
  }

  record.title = title;
  record.body = body;

  const save = await record.save();
  if (save) {
    res.json({
      message: ` Note Updated`,
    });
  } else {
    res.json({ message: "Save Failed" });
  }
});

// Delete Professor
const deleteNotes = asyncHandler(async (req, res) => {
  if (!req.params.noteId) {
    return res.status(400).json({ message: "Note ID required" });
  }

  const record = await Notes.findById(req.params.noteId).exec();

  if (!record) {
    return res.status(404).json({ message: "Note not found" });
  }

  await record.deleteOne();

  res.json({
    message: `Note Deleted`,
  });
});

module.exports = {
  getNotes,
  getNote,
  addNotes,
  updateNotes,
  deleteNotes,
};
