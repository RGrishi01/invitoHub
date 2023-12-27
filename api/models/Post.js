const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const PostSchema = new Schema(
  {
    title: String,
    description: String,
    cover: String,
  },
);

const PostModel = model("Post", PostSchema);

module.exports = PostModel;
