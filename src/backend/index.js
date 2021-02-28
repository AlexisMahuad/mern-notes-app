const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
// Connect to MongoDB
const URI = process.env.MDB_CONNECT;
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => {
    console.error(err);
  });

// Global variables
app.set("port", process.env.PORT || 4000);

// Middlewares
app.use(morgan("dev"));
app.use(express.json());
app.use(cors());

// Static Files
app.use(express.static(path.join(__dirname, "../../dist/")));

// Routes
app.use("/api/notes", require(path.join(__dirname, "routes", "notesRouter")));
app.use("/auth", require(path.join(__dirname, "routes", "userRouter")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../dist/index.html"));
});

// Starting the server
app.listen(app.get("port"), () => {
  console.log("Server on port " + app.get("port"));
});
