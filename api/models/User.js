const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, min: 4, unique: true },
  contacts: {
    names: [{ type: String, required: true }],
    phoneNumbers: [{ type: String, required: true }],
  },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
