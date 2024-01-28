import React from "react";
import "./CSS/AuthPage.css";

export default function AuthPage() {
  return (
    <div className="landing-container">
      <header>
        <h1>Welcome to InvitoHub</h1>
        <p>Your Ultimate Event Hub</p>
      </header>

      <section className="cta-section">
        <p>Discover, create, and connect with exciting events.</p>
        <p>
          Whether you're hosting a gathering or looking for the next big thing,
        </p>
        <p>InvitoHub is your go-to platform. Join the celebration!</p>
      </section>
    </div>
  );
}
