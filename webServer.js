const express = require("express");
const mongoose = require("mongoose");
const User = require("./db/userModel");
const Photo = require("./db/photoModel");

const app = express();

const dbUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/photoapp";

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

// Routes

app.get("/user/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

app.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    res.json({
      _id: user._id,
      first_name: user.first_name,
      last_name: user.last_name,
      location: user.location,
      description: user.description,
      occupation: user.occupation,
    });
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});

app.get("/photosOfUser/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }
    const photos = await Photo.find({ user_id: req.params.id });
    // For each photo, populate comments with user info
    const result = photos.map((photo) => ({
      _id: photo._id,
      user_id: photo.user_id,
      comments: photo.comments.map((comment) => ({
        comment: comment.comment,
        date_time: comment.date_time,
        _id: comment._id,
        user: {
          _id: comment.user._id,
          first_name: comment.user.first_name,
          last_name: comment.user.last_name,
        },
      })),
      file_name: photo.file_name,
      date_time: photo.date_time,
    }));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: "Invalid user ID" });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
