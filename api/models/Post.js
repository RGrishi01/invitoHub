const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema({
  user_host: { type: Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  cover: { type: String, required: true },
  users_invited: [{ type: String, required: true }],
  publicEvent: { type: Boolean, default: false },
  users_registered: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
