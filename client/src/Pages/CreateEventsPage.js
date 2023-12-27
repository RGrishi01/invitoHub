import React, { useState } from "react";
import { Navigate } from "react-router-dom";

export default function CreateEventsPage() {
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);

  async function createNewPost(ev) {
    ev.preventDefault();
    let data = new FormData();
    console.log(title + " " + description + " " + files[0]);
    data.set("title", title);
    data.set("description", description);
    data.set("file", files[0]);
    console.log(files);
    console.log(data);
    const response = await fetch("http://localhost:4000/post", {
      method: "POST",
      body: data,
      // headers: {
      //   // "Content-Type": "application/x-www-form-urlencoded",
      //   "Content-Type": "multipart/form-data",
      // },
    });
    console.log(data.file);

    if (response.ok) {
      setRedirect(true);
    }

    if (redirect) return <Navigate to={"/create/events/contacts"} />;
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
