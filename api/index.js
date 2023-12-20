require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { google } = require("googleapis");
const mongoose = require("mongoose");
const User = require("./models/User");
const Contacts = require("./models/Contacts");
const app = express();

app.use(cors());
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
  console.log("Connections:");
  connections.forEach((person) => {
    if (person.names && person.names.length > 0) {
      console.log(person.names[0].displayName);
    } else {
      console.log("No display name found for connection.");
    }
  });
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
  const token = req.body.access_token;
  console.log(token);

  const auth = new google.auth.OAuth2();
  auth.setCredentials({ access_token: token });

  const contacts = listConnectionNames(auth);
  try {
    await User.findOne({ email }).populate("Contacts");
  } catch (err) {
    console.log(err);
  }

  res.json({ message: "ok" });
});
