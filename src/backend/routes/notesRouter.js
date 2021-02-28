const express = require("express");
const router = express.Router();

const Note = require("../models/noteModel");

router
  .route("/")
  // Load user notes
  .get(async (req, res) => {
    const username = req.header("username");

    const userNotes = await Note.find({ author: username });
    res.json(userNotes);
  })
  // Create new note
  .post(async (req, res) => {
    const { title, text, author, color, public } = req.body;

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

router
  .route("/:id")
  // Update one note
  .put(async (req, res) => {
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
  })
  // Delete one note
  .delete(async (req, res) => {
    await Note.findByIdAndDelete(req.params.id);
    res.json({ message: "Eliminado satisfactoriamente" });
  });

router
  .route("/public")
  // Load public notes
  .get(async (req, res) => {
    const publicNotes = await Note.find({ public: true });

    res.json(publicNotes);
  });

module.exports = router;
