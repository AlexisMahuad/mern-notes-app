const express = require("express");

// Models
const Note = require("../models/noteModel");

// Router
// *****************************
const router = express.Router();

// Get all the user's notes
// ************************
router.get("/", async (req, res) => {
  const username = req.header("username");
  const from = parseInt(req.header("from"));

  const userNotes = await Note.find({ author: username })
    .sort({ date: -1 })
    .limit(8)
    .skip(from);

  res.json(userNotes);
});

// Create new note
// ***************
router.post("/", async (req, res) => {
  const { title, text, author, color, public } = req.body;
  console.log(title, text);

  if (!title || !text) {
    res.json({ errorMessage: "Todas las casillas deben contener algo" });
  } else {
    const newNote = new Note({
      title,
      text,
      author,
      color,
      public,
    });
    await newNote.save();
    res.json({ message: "Nota añadida", content: newNote });
  }
});

// Update note
// ***********
router.put("/:id", async (req, res) => {
  const { title, text, color, public } = req.body;
  await Note.findOneAndUpdate(
    { _id: req.params.id },
    { title, text, color, public }
  );

  // Delivering the updated note
  const updatedNote = {
    title,
    text,
    color,
    public,
  };
  res.json({ message: "Nota actualizada", updatedNote, id: req.params.id });
});

// Delete note
// ***********
router.delete("/:id", async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: "Eliminado satisfactoriamente" });
});

// Get public notes
// ************
router.get("/public/:from", async (req, res) => {
  const from = parseInt(req.params.from);
  const publicNotes = await Note.find({ public: true })
    .sort({ date: -1 })
    .limit(8)
    .skip(from);

  res.json(publicNotes);
});

module.exports = router;
