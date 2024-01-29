import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../Components/UserContext";
import "./CSS/InvitedEventPage.css";

export default function InvitedEvent() {
  const [posts, setPosts] = useState([]);
  const { userEmail } = useContext(UserContext);
  const { post_id } = useParams();
  const navigate = useNavigate();
  console.log(post_id);

  useEffect(() => {
    async function getInvitedPost(post_id) {
      try {
        const response = await fetch("http://localhost:4000/invited-event", {
          method: "POST",
          body: JSON.stringify({ post_id: post_id }),
          headers: { "Content-type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        console.log(data);
        setPosts(data);
      } catch (err) {
        console.log("Error while fetching invited post: ", err);
      }
    }

    getInvitedPost(post_id);
  }, [post_id]);

  async function sendDetails(ev) {
    ev.preventDefault();
    try {
      const response = await fetch("http://localhost:4000/send-details", {
        method: "POST",
        body: JSON.stringify({ post_id: post_id, email: userEmail }),
        headers: { "Content-type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) navigate("/events/your-events");
    } catch (err) {
      console.log("Error while sending contact details: ", err);
    }
  }

  return (
    <div>
      <p className="efhe">You have been invited to: </p>
      <form className="ekwgfk" onSubmit={sendDetails}>
        <div className="elbflw" key={posts._id}>
          <img className="shgffh" src={"http://localhost:4000/" + posts.cover} alt="" />
          <h3 className="eiwlhgfl">{posts.title}</h3>
          <p className="ewufge">{posts.description}</p>
          {/* Add more details or components to display other post information */}
        </div>
        <button className="ejkfg">Join Event</button>
      </form>
    </div>
  );
}
