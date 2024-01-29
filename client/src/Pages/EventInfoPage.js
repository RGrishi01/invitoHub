import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./CSS/EventInfoPage.css";

export default function EventInfoPage() {
  const [post, setPost] = useState([]);
  const [registeredContacts, setRegisteredContacts] = useState([]);
  const { post_id } = useParams();
  console.log("parameter post id: ", post_id);

  useEffect(() => {
    async function getEventInfo(post_id) {
      try {
        const response = await fetch("http://localhost:4000/get-event-info", {
          method: "POST",
          body: JSON.stringify({ post_id }),
          headers: { "Content-type": "application/json" },
          credentials: "include",
        });
        const data = await response.json();
        console.log("postdoc: ", data);
        setPost(data);
        console.log("registered contacts: ", data.users_registered);
      } catch (err) {
        console.log("Error while fetching event info: ", err);
      }
    }

    getEventInfo(post_id);
  }, [post_id]);

  useEffect(() => {
    async function getRegisteredContacts(registeredContacts) {
      try {
        console.log("inside");
        const response = await fetch("http://localhost:4000/get-registered-contact-names", {
          method: "POST",
          body: JSON.stringify({ registeredContacts }),
          credentials: "include",
          headers: { "Content-type": "application/json" },
        });
        const data = await response.json();
        console.log("registered contact names:", data);
        if (Array.isArray(data)) setRegisteredContacts(data);
      } catch (err) {
        console.log("Error while fetching registered contact names: ", err);
      }
    }

    getRegisteredContacts(post.users_registered);
  }, [post]);

  return (
    <div>
      <h1 className="leshf">Event Info</h1>
      <div className="ejkfe" key={post._id}>
        <img className="kejfgewjl" src={"http://localhost:4000/" + post.cover} alt="" />
        <h3 className="afhelahf">{post.title}</h3>
        <p className="aelifheal">{post.description}</p>
        {registeredContacts.length > 0 ? (
          <>
            <h3>Registered Contacts: </h3>
            <br />
            <ul>
              {registeredContacts.map((contact) => (
                <li>
                  <p>{contact}</p>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>No Registered Contacts yet</p>
        )}
      </div>
    </div>
  );
}
