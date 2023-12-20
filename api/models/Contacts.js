const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ContactsSchema = new Schema({
  name: { type: String },
});

const ContactsModel = model("Contacts", ContactsSchema);

module.exports = ContactsModel;
