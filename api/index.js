require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const twilio = require("twilio");
const fs = require("fs");
const app = express();

let user_id;
let post_id;
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = 4000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function connection() {
  try {
    mongoose.connect(process.env.DB_CONNECTION_URL);
    console.log("Connected to the Database");
  } catch (error) {
    console.log("Failed to connect to database" + error.message);
  }
}
connection();

async function listConnectionNames(auth) {
  const service = google.people({
    version: "v1",
    auth: auth,
  });
  const res = await service.people.connections.list({
    resourceName: "people/me",
    pageSize: 1000,
    personFields: "names,phoneNumbers",
  });
  const connections = res.data.connections;
  if (!connections || connections.length === 0) {
    console.log("No connections found.");
    return;
  }
  console.log(connections);
  return connections;
}

function sendSMS(phoneNumber, message) {
  const client = new twilio(
    process.env.TWILIO_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
  return client.messages
    .create({
      body: message,
      from: "+13868668730",
      to: phoneNumber,
    })
    .then((message) => console.log(message, "message sent"))
    .catch((err) => console.log(err));
}

app.post("/login", async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
    let userDoc = await User.findOne({ email });
    if (!userDoc) {
      userDoc = await User.create({ email });
      console.log("user registered");
    } else {
      console.log("user logged in");
    }
    user_id = userDoc._id;
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/get-contacts", async (req, res) => {
  const email = req.body.email;
  const token = req.body.token.access_token;
  console.log(token);

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });

  const contacts = await listConnectionNames(auth);

  const contactNames = contacts.map((person) =>
    person.names && person.names.length > 0
      ? person.names[0].displayName
      : "No display name found"
  );

  const contactNumbers = contacts.map((person) =>
    person.phoneNumbers && person.phoneNumbers.length > 0
      ? person.phoneNumbers[0].value
      : "No Phone Number found"
  );

  console.log(contactNames);
  console.log(contactNumbers);

  try {
    const user = await User.findOne({ email });

    if (user) {
      user.contacts.names = [];
      user.contacts.phoneNumbers = [];
      user.contacts.names.push(...contactNames);
      user.contacts.phoneNumbers.push(...contactNumbers);
      await user.save();
      console.log("Contacts updated for user:", user);
      res.json({ message: "Contacts updated successfully" });
    } else {
      console.log("User not found");
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error("Error updating contacts:", error);
    res.status(500).json({ error: "Failed to update contacts" });
  }
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  const { originalname, path } = req.file;
  console.log(originalname + " " + path);
  const newName = `uploads\\` + originalname;
  fs.renameSync(path, newName);
  const { title, description } = req.body;
  console.log(req.body);

  try {
    const postDoc = await Post.create({
      user: user_id,
      title,
      description,
      cover: newName,
    });
    post_id = postDoc._id;
    console.log("Post created: ", postDoc, post_id);
    res.json(postDoc);
  } catch (err) {
    console.log("Error while creating Post: " + err);
    res.json(500).json({ error: "Failed to create post" });
  }
});

app.post("/select-contacts", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    const names = user.contacts.names;
    res.json(names);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.post("/send-contacts", async (req, res) => {
  const data = req.body.selectedContacts;
  const email = req.body.email;
  console.log(data);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.json("no such user found");
    } else {
      const contacts = user.contacts.phoneNumbers;
      const contactArray = [];
      for (let i of data) {
        console.log(contacts[i]);
        contactArray.push(contacts[i]);
        // sendSMS(contacts[i], "Text");
      }
      const postDoc = await Post.findOne({ _id: post_id });
      postDoc.contacts = contactArray;
      res.json(data);
    }
  } catch (err) {
    console.log("Error while sending sms", err);
    res.status(400).json(err);
  }
});

app.get("/your-events", async (req, res) => {
  try {
    const postDocs = await Post.find({ user: "65a6dfde4762fb0e3f1bf218"});
    console.log(postDocs);
    res.json(postDocs);
  } catch (err) {
    console.log("Error while fetching your events: ", err);
    res.json(err);
  }
});
