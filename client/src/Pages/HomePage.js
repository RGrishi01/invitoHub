import React, { useEffect, useState } from "react";
import "./CSS/HomePage.css";

export default function HomePage() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    async function getPublicPosts() {
      try {
        const response = await fetch("http://localhost:4000/get-public-events");
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setPosts(data);
        }
      } catch (err) {
        console.log("Error while getting public posts: ", err);
      }
    }

    getPublicPosts();
  }, []);

  return (
    <>
      <h1>Public Posts</h1>
      <div className="container">
        {posts.map((post) => (
          <div key={post._id} className="post">
            <img src={"http://localhost:4000/" + post.cover} alt="" />
            <h3 className="post-title">{post.title}</h3>
            <p className="post-des">{post.description}</p>
          </div>
        ))}
      </div>
    </>
  );
}
