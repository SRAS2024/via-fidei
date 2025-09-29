// client/src/pages/Login.js
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      localStorage.setItem("vf_token", data.token);
      if (data.user?.displayName) localStorage.setItem("vf_name", data.user.displayName);
      const redirect = new URLSearchParams(location.search).get("r") || "/profile";
      navigate(redirect);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container card stack" style={{ maxWidth: 520 }}>
      <h1>Login</h1>
      {error && <p className="muted" style={{ color: "var(--vf-red)" }}>{error}</p>}
      <form className="stack" onSubmit={onSubmit}>
        <div className="stack">
          <label htmlFor="lo-email">Email</label>
          <input id="lo-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="stack">
          <label htmlFor="lo-pass">Password</label>
          <input id="lo-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-primary" disabled={busy} type="submit">Login</button>
          <Link className="btn btn-ghost" to="/register">Create Account</Link>
        </div>
      </form>
      <div><Link to="/forgot-password">Forgot password</Link></div>
    </section>
  );
}
