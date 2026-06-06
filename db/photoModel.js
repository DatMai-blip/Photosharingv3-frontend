const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  _id: String,
  date_time: Date,
  comment: String,
  user: {
    _id: String,
    first_name: String,
    last_name: String,
  },
  photo_id: String,
});

const PhotoSchema = new mongoose.Schema({
  _id: String,
  date_time: Date,
  file_name: String,
  user_id: String,
  comments: [CommentSchema],
});

module.exports = mongoose.model("Photo", PhotoSchema);
