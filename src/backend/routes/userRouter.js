const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");

// Models
const User = require("../models/userModel");
const contentHTML = require("../models/mailModel");

// Mail transporter
const transporter = require("../middleware/mailer");

// Router
// *****************************
const router = express.Router();

// Register
// ********
router.post("/register", async (req, res) => {
  try {
    const { email, username, password, confirmPassword } = req.body;

    // Checking if all the fields has been sent.
    if (!email || !username || !password || !confirmPassword) {
      return res.json({
        errorMessage: "Por favor, escribe algo en todas las casillas",
      });
    }

    // Checking if the passwords are the same.
    if (password !== confirmPassword) {
      return res.json({ errorMessage: "Revise las contraseñas." });
    }

    // Checkign if the user already exists.
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.json({
        errorMessage: "Ya existe una cuenta con ese email",
      });
    }
    const emailExists = await User.findOne({ username });
    if (emailExists) {
      return res.json({
        errorMessage: "Ya existe una cuenta con ese nombre de usuario.",
      });
    }

    // Encrypt the password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Save the new user
    const newUser = new User({
      email,
      username,
      passwordHash,
      pending: true,
    });
    await newUser.save();

    try {
      await transporter.sendMail({
        from: '"NodemailerApp', // sender address
        to: email, // list of receivers
        subject: "Email Verification", // Subject line
        html: contentHTML(newUser._id), // html body
      });
    } catch (err) {
      console.error(err);
    }

    res.json({ status: true });

    // Handle Errors
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// Pending
// *******
router.post("/pending", async (req, res) => {
  try {
    await User.findOneAndUpdate({ _id: req.body.id }, { pending: false });

    // Handle Errors
  } catch (err) {
    console.error(err);
  }
});

// Login
// *****
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Checking if all the fields has been sent.
    if (!email || !password) {
      return res.json({ errorMessage: "Mail o contraseña erroneos" });
    }

    // Checking if the email exists
    const existingUser = await User.findOne({ email });

    if (existingUser.pending) {
      return res.json({ errorMessage: "Esta cuenta no está verificada" });
    }

    if (!existingUser) {
      return res.json({ errorMessage: "Mail o contraseña erroneos" });
    }

    //   Checking the password
    const comparePassword = await bcrypt.compare(
      password,
      existingUser.passwordHash
    );

    if (!comparePassword) {
      return res.json({ errorMessage: "Mail o contraseña erroneos" });
    }

    // Log in.
    const token = jwt.sign(
      {
        user: existingUser._id,
      },
      process.env.JWT_SECRET
    );

    res.json({ token, username: existingUser.username });

    // Handle Errors
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
});

// TokenIsValid
// ************
router.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.user);
    if (!user) return res.json(false);

    return res.json(true);

    //
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Auth
// ****
router.get("/", auth, async (req, res) => {
  const token = req.header("x-auth-token");
  const id = jwt.verify(token, process.env.JWT_SECRET).user;

  const user = await User.findById(id);
  res.json({
    token,
    username: user.username,
  });
});

module.exports = router;
