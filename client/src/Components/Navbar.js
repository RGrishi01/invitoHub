/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate, useLocation } from "react-router-dom";
// import dotenv from 'dotenv';
import "./CSS/Navbar.css";

// dotenv.config();

const google = window.google;

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  let location = useLocation();
  console.log(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: handleCallbackResponse,
      });
      // google.accounts.id.renderButton(document.getElementById("signInDiv"), {
      //   theme: "outline",
      //   size: "large",
      // });
    } catch (err) {
      console.log(err);
    }

    if (!redirect && location.pathname === "/") prompt();
  }, []);

  useEffect(() => {
    async function handleRedirect() {
      try {
        const client = await google.accounts.oauth2.initTokenClient({
          client_id: process.env.REACT_APP_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/contacts.readonly",
          callback: initTokenClient,
        });
        await client.requestAccessToken({ prompt: "" });
        console.log("Access token response: ", client);
      } catch (err) {
        console.log("Error initiating token client: ", err);
      }
    }

    if (location.pathname === "/home" && accessToken === "") handleRedirect();
  }, [location]);

  async function initTokenClient(response) {
    console.log("response: " + response);
    await sendAccessToken(user.email, response);
    setAccessToken(response);
  }

  async function handleCallbackResponse(response) {
    try {
      const token = response.credential;
      console.log("Encoded JWT ID token: " + token);
      let userObject = jwtDecode(response.credential);
      if (userObject) {
        console.log(userObject);
        setUser(userObject);
        console.log("email: " + userObject.email);
        await login(userObject.email);
      } else {
        console.log("Invalid JWT Token!");
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function login(email) {
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-type": "application/json" },
      });
      if (response.ok === false) alert("login failed");
      else {
        setRedirect(true);
      }
    } catch (err) {
      console.log("Error while making post request: " + err);
    }
  }

  if (redirect) {
    setRedirect(false);
    navigate("/home");
  }

  function prompt() {
    google.accounts.id.prompt((noti) => {
      console.log("Prompt Displayed: " + noti.isDisplayMoment());
    });
  }

  async function sendAccessToken(email, token) {
    try {
      await fetch("http://localhost:4000/contacts", {
        method: "POST",
        body: JSON.stringify({ email, token }),
        headers: { "Content-type": "application/json" },
      }).then((response) => console.log(response));
    } catch (err) {
      console.log("Error while sending access token: " + err);
    }
  }

  function signOut() {
    setAccessToken("");
    setUser(null);
    prompt();
    setRedirect(false);
    navigate("/");
  }

  return (
    <div className="navbar">
      <div className="brand">
        <Link to="/home" className="redirect">
          InvitoHub
        </Link>
      </div>
      <div className="links">
        <Link to="/events/create" className="create-event">
          Create Event
        </Link>
        <Link to="/events/your-events" className="your-events">
          Your Events
        </Link>
      </div>
      <div className="user-section">
        {user && (
          <button
            onClick={() => {
              signOut();
            }}
          >
            Sign Out
          </button>
        )}
        {user && (
          <div className="user-details">
            <img src={user.picture} alt=""></img>
            <p>{user.name}</p>
          </div>
        )}
      </div>
    </div>
  );
}
