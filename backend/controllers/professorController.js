const Professor = require("./../models/Professor");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

//  Get Professor
const getProfessor = asyncHandler(async (req, res) => {
  if (!req?.params?.id) return res.status(400).json({ message: "ID Missing" });

  const professor = await Professor.findById(req.params.id)
    .select("-password -_id -__v")
    .lean();
  if (!professor) {
    return res.status(404).json({ message: "No Professor Found." });
  }
  res.json(professor);
});

// Get all Professors
const getNewProfessors = asyncHandler(async (req, res) => {
  if (!req?.params?.department)
    return res.status(400).json({ message: "Params Missing" });

  // Fetch professors from the specified department with no specific role assigned
  const professors = await Professor.find({
    department: "Information Systems",
    role: "" // This will match professors whose role field is an empty string
  })
  .select("-password")
  .lean();

  if (!professors?.length) {
    return res.status(404).json({ message: "No Registered Professor(s) Found." });
  }

  res.json(professors);
});


// Get Professor Names only
const getProfessorList = asyncHandler(async (req, res) => {
  if (!req?.params?.department)
    return res.status(400).json({ message: "Params Missing" });

  const professorsList = await Professor.find({
    department: req.params.department,
  })
    .select("name")
    .lean();
  if (!professorsList?.length) {
    return res.status(400).json({ message: "No Professor(s) Found" });
  }
  res.json(professorsList);
});

// Create New Professor
const createNewProfessor = asyncHandler(async (req, res) => {
  const { username, name, email, qualification, department, password, roles } =
    req.body;

  // Confirm Data
  if (
    !username ||
    !name ||
    !email ||
    !qualification ||
    !department ||
    !password
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check for Duplicates
  const duplicate = await Professor.findOne({ username }).lean().exec();

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate Username" });
  }

  // Hash Password
  const hashedPwd = await bcrypt.hash(password, 10); // salt rounds

  const professorObj = {
    username,
    name,
    email,
    qualification,
    department,
    password: hashedPwd,
    roles,
  };

  // Create and Store New professor
  const professor = await Professor.create(professorObj);

  if (professor) {
    res.status(201).json({ message: `New Professor ${username} Registered` });
  } else {
    res.status(400).json({ message: "Invalid data received" });
  }
});

// Update Professor
const approveProfessor = asyncHandler(async (req, res) => {
  const { id, roles } = req.body;
  console.log(req.body)

  // Confirm Data
  if ((!id, !roles)) {
    return res.status(400).json({ message: "All fields are required" });
  }
  // Find Professor
  const professor = await Professor.findById(id).exec();
  if (!professor) {
    return res.status(400).json({ message: "User not found" });
  }

  professor.roles = roles;

  await professor.save();

  res.json({ message: "Professor Approved" });
});

// Delete Professor

const deleteProfessor = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Professor ID required" });
  }

  const professor = await Professor.findById(id).exec();

  if (!professor) {
    return res.status(400).json({ message: "Professor not found" });
  }

  const result = await professor.deleteOne();

  res.json({ message: `${result.username} deleted` });
});

module.exports = {
  getProfessor,
  getNewProfessors,
  getProfessorList,
  createNewProfessor,
  approveProfessor,
  deleteProfessor,
};
