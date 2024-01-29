import React, { useEffect, useState } from "react";
import "./CSS/YourEvents.css";
import { Link } from "react-router-dom";

export default function YourEvents() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      try {
        const response = await fetch("http://localhost:4000/your-events", {
          method: "GET",
        });
        if (response.ok) {
          const data = await response.json();
          setPosts(data);
        } else {
          console.error("Failed to fetch posts");
        }
      } catch (err) {
        console.log("Error while fetching your events: ", err);
      }
    }

    if (posts.length === 0) getPosts();
  }, []);

  return (
    <div className="container">
      <p className="your-event-header">Your Events</p>
      {posts.map((post) => (
        <div key={post._id} className="event">
          <img src={"http://localhost:4000/" + post.cover} alt="" />
          <Link to={`/events/event-info/${post._id}`} className="post-title">
            {post.title}
          </Link>
          <p className="post-des">{post.description}</p>
        </div>
      ))}
    </div>
  );
}
