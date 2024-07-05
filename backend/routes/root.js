const express = require("express");
const router = express.Router();
const path = require("path");

// The '^/$|/index(.html)?' is a regular expression that matches either the root URL or the index page.
router.get("^/$|/index(.html)?", (req, res) => {

  // The path.join method is used to construct the path to the 'index.html' file.
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
