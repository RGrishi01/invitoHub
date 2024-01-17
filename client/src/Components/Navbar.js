/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "./UserContext";
import "./CSS/Navbar.css";

const google = window.google;

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [redirect, setRedirect] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const { setUserEmail } = useContext(UserContext);
  let location = useLocation();
  console.log(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: getJWTToken,
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

  async function getJWTToken(response) {
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

  useEffect(() => {
    async function handleRedirect() {
      try {
        const client = await google.accounts.oauth2.initTokenClient({
          client_id: process.env.REACT_APP_CLIENT_ID,
          scope: "https://www.googleapis.com/auth/contacts.readonly",
          callback: getAccessToken,
        });
        await client.requestAccessToken({ prompt: "" });
        console.log("Access token response: ", client);
      } catch (err) {
        console.log("Error initiating token client: ", err);
      }
    }

    if (location.pathname === "/home" && accessToken === "") handleRedirect();
  }, [location]);

  async function getAccessToken(response) {
    console.log("response: " + response);
    setAccessToken(response);
    await sendAccessToken(user.email, response);
  }

  async function sendAccessToken(email, token) {
    try {
      await fetch("http://localhost:4000/get-contacts", {
        method: "POST",
        body: JSON.stringify({ email, token }),
        headers: { "Content-type": "application/json" },
      }).then((response) => console.log(response));
    } catch (err) {
      console.log("Error while sending access token: " + err);
    }
  }

  async function login(email) {
    setUserEmail(email);
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

  function signOut() {
    setAccessToken("");
    setUser(null);
    setUserEmail("");
    prompt();
    setRedirect(false);
    navigate("/");
  }

  function prompt() {
    google.accounts.id.prompt((noti) => {
      console.log("Prompt Displayed: " + noti.isDisplayMoment());
    });
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
