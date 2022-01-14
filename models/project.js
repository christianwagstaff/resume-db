const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  name: { type: String, required: true },
  details: { type: String, required: true },
  img: { type: String },
});

module.exports = mongoose.model("Project", ProjectSchema);
