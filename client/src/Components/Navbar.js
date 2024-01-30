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
  const { setUserEmail, setUserId } = useContext(UserContext);
  let location = useLocation();
  console.log(location.pathname);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      google.accounts.id.initialize({
        client_id: process.env.REACT_APP_CLIENT_ID,
        callback: getJWTToken,
      });
    } catch (err) {
      console.log(err);
    }

    if (!redirect && !user) prompt();
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
        await login(userObject.name, userObject.email, token);
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

    if (location.pathname !== "/" && accessToken === "" && user) handleRedirect();
  }, [user, location]);

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
        credentials: "include",
      }).then((response) => console.log(response));
    } catch (err) {
      console.log("Error while sending access token: " + err);
    }
  }

  async function login(name, email, token) {
    setUserEmail(email);
    try {
      const response = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({ name: name, email: email, token: token }),
        headers: { "Content-type": "application/json" },
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok === false) alert("login failed");
      else {
        setRedirect(true);
        console.log(data._id);
        setUserId(data._id);
      }
    } catch (err) {
      console.log("Error while making post request: " + err);
    }
  }

  if (redirect) {
    setRedirect(false);
    if (location.pathname === "/") {
      navigate("/home");
    }
  }

  async function signOut() {
    await fetch("http://localhost:4000/logout", {
      credentials: "include",
      method: "POST",
    });
    setAccessToken("");
    setUser(null);
    setUserEmail("");
    prompt();
    setRedirect(false);
    navigate("/");
  }

  function signIn() {
    prompt();
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
          <img
            className="logo"
            src={process.env.PUBLIC_URL + "./InvitohubLogo.png"}
            alt=""
            style={{ width: "100px" }}
          />
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
          </div>
        )}
        {!user && (
          <div className="sign-in">
            <button
              onClick={() => {
                signIn();
              }}
            >
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
