const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AboutSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  headline: { type: String, required: true },
  about: { type: String, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model("About", AboutSchema);
