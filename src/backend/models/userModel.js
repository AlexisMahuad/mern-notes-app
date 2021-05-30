const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  passwordHash: { type: String, required: true },
  pending: { type: Boolean, required: true },
});

const User = model("user", UserSchema);
module.exports = User;
