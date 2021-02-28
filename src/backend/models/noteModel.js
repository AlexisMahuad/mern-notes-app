const { Schema, model } = require("mongoose");

const noteSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  author: { type: String, required: true },
  color: { type: String, required: true },
  public: { type: Boolean, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = model("Note", noteSchema);
