// client/src/pages/ForgotPassword.js
import React from "react";

export default function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to send reset email");
      setSent(true);
    } catch (err) {
      setError(err.message || "Failed to send reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container card stack" style={{ maxWidth: 520 }}>
      <h1>Forgot password</h1>
      {sent ? (
        <p className="muted">
          If an account exists for that address, a reset link has been sent.
        </p>
      ) : (
        <>
          {error && (
            <p className="muted" style={{ color: "var(--vf-red)" }}>
              {error}
            </p>
          )}
          <form className="stack" onSubmit={onSubmit}>
            <div className="stack">
              <label htmlFor="fp-email">Email</label>
              <input
                id="fp-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button type="submit" className="btn btn-primary" disabled={busy}>
                Send reset link
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  );
}
