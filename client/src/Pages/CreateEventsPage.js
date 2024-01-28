import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CSS/CreateEventsPage.css";

export default function CreateEventsPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState("");
  const [publicEvent, setPublicEvent] = useState(false);
  const navigate = useNavigate();

  async function createNewPost(ev) {
    ev.preventDefault();
    let data = new FormData();
    console.log(title + " " + description + " " + files[0]);
    data.set("title", title);
    data.set("description", description);
    data.set("file", files[0]);
    data.set("publicEvent", publicEvent);
    console.log(files);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      credentials: "include",
    });
    console.log(response);
    if (response.ok) {
      if (publicEvent) navigate("/events/your-events");
      else navigate("/events/create/contacts");
    }
  }

  async function togglePublicEvent() {
    setPublicEvent((publicEvent) => !publicEvent);
  }

  return (
    <form onSubmit={createNewPost}>
      <h1>Event Information</h1>
      <label>
        <input
          type="checkbox"
          onChange={() => {
            togglePublicEvent();
          }}
        />
        Set as a Public Event
      </label>
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
