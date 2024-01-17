import React, { useEffect, useState } from "react";

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

    getPosts();
  }, []);

  return (
    <div>
      <p>YourEvents</p>
      {posts.map((post) => (
        <div key={post._id}>
          <img src={"http://localhost:4000/" + post.cover} alt="" />
          <h3>{post.title}</h3>
          <p>{post.description}</p>
          {/* Add more details or components to display other post information */}
        </div>
      ))}
    </div>
  );
}
