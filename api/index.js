require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const app = express();

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
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
    personFields: "names",
  });
  const connections = res.data.connections;
  if (!connections || connections.length === 0) {
    console.log("No connections found.");
    return;
  }
  return connections;
}

app.post("/login", async (req, res) => {
  const email = req.body.email;
  console.log(email);
  try {
    const userDoc = await User.findOne({ email });
    if (!userDoc) {
      userDoc = await User.create({ email });
      console.log("user registered");
    } else {
      console.log("user logged in");
    }
    res.json(userDoc);
  } catch (e) {
    console.log(e);
    res.status(400).json(e);
  }
});

app.post("/contacts", async (req, res) => {
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

  try {
    const user = await User.findOne({ email });

    if (user) {
      user.contacts = contactNames;
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
  const postDoc = await Post.create({
    title,
    description,
    cover: newName,
  });
  res.json(postDoc);
});
