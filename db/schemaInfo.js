const mongoose = require("mongoose");

const SchemaInfoSchema = new mongoose.Schema({
  _id: String,
  __v: Number,
  load_date_time: Date,
});

module.exports = mongoose.model("SchemaInfo", SchemaInfoSchema);
