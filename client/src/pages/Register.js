// client/src/pages/Register.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = React.useState("");
  const [lastName, setLastName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [show, setShow] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      const displayName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ");
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, displayName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Registration failed");
      localStorage.setItem("vf_token", data.token);
      if (data.user?.displayName) localStorage.setItem("vf_name", data.user.displayName);
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container card stack" style={{ maxWidth: 560 }}>
      <h1>Create Account</h1>
      {error && <p className="muted" style={{ color: "var(--vf-red)" }}>{error}</p>}
      <form className="stack" onSubmit={onSubmit}>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div className="stack">
            <label htmlFor="re-fn">First Name</label>
            <input id="re-fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div className="stack">
            <label htmlFor="re-ln">Last Name</label>
            <input id="re-ln" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div className="stack">
          <label htmlFor="re-email">Email</label>
          <input id="re-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr auto", gap: 10 }}>
          <div className="stack">
            <label htmlFor="re-pass">Password</label>
            <input id="re-pass" type={show ? "text" : "password"} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="stack">
            <label htmlFor="re-pass2">Re enter Password</label>
            <input id="re-pass2" type={show ? "text" : "password"} autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <div className="stack" style={{ alignSelf: "end" }}>
            <button type="button" className="btn btn-ghost" onClick={() => setShow(v => !v)}>{show ? "Hide" : "View"}</button>
          </div>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" disabled={busy} type="submit">Create Account</button>
          <Link className="btn btn-secondary" to="/login">Cancel</Link>
        </div>
      </form>
      <p className="muted">Already have an account? <Link to="/login">Login</Link>.</p>
    </section>
  );
}
