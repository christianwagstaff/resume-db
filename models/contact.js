const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ContactSchema = new Schema({
  user: { type: Schema.Types.ObjectId, required: true },
  email: { type: String, required: true },
  links: [
    {
      name: { type: String, required: true },
      url: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Contact", ContactSchema);
