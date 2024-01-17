const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover: { type: String, required: true },
  contacts: [{ type: String, required: true }],
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
