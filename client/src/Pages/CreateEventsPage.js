import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateEventsPage() {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [files, setFiles] = useState("");
  const navigate = useNavigate();

  async function createNewPost(ev) {
    ev.preventDefault();
    let data = new FormData();
    console.log(title + " " + description + " " + files[0]);
    data.set("title", title);
    data.set("description", description);
    data.set("file", files[0]);
    console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
    });
    console.log(response);
    if (response.ok) {
      navigate("/events/create/contacts");
    }
  }

  return (
    <form onSubmit={createNewPost}>
      <h1>Event Information</h1>
      <input
        type="text"
        id="title"
        placeholder="Title"
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
        required
      />
      <textarea
        id="description"
        placeholder="Description"
        rows="4"
        cols="50"
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
        required
      ></textarea>
      <input type="file" onChange={(ev) => setFiles(ev.target.files)} />
      <button style={{ marginTop: "5px" }}>Create Event</button>
    </form>
  );
}
