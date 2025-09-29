// client/src/pages/Profile.js
import React from "react";

export default function Profile() {
  const name = localStorage.getItem("vf_name") || "Your Profile";
  return (
    <section className="container card stack">
      <h1>{name}</h1>
      <p className="muted">Profile content will appear here.</p>
    </section>
  );
}
