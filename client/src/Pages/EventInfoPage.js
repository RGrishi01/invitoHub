import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CSS/EventInfoPage.css";

export default function EventInfoPage() {
  const [post, setPost] = useState([]);
  const { post_id } = useParams();
  console.log(post_id);

  useEffect(() => {
    async function getEventInfo(post_id) {
      try {
        const response = await fetch("http://localhost:4000/get-event-info", {
          method: "POST",
          body: JSON.stringify({ post_id }),
          headers: { "Content-type": "application/json" },
        });
        const data = await response.json();
        console.log(data);
        setPost(data);
      } catch (err) {
        console.log("Error while fetching event info: ", err);
      }
    }

    getEventInfo(post_id);
  }, [post_id]);

  return (
    <div>
      <h1 className="leshf">EventInfo</h1>
      <div className="ejkfe" key={post._id}>
        <img
          className="kejfgewjl"
          src={"http://localhost:4000/" + post.cover}
          alt=""
        />
        <h3 className="afhelahf">{post.title}</h3>
        <p className="aelifheal">{post.description}</p>
      </div>
    </div>
  );
}
