// client/src/pages/Home.js
import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section className="container stack-lg">
      <header className="card stack">
        <h1>Via Fidei</h1>
        <p className="muted">
          A multilingual Catholic reference that is clear, beautiful, and deep.
        </p>
      </header>

      <div className="grid grid-3">
        <Link to="/prayers" className="card stack">
          <h3>Prayers</h3>
          <p className="muted">Curated prayers in many languages.</p>
        </Link>
        <Link to="/spiritual-life" className="card stack">
          <h3>Spiritual Life</h3>
          <p className="muted">Guides, checklists, and consecrations.</p>
        </Link>
        <Link to="/spiritual-guidance" className="card stack">
          <h3>Spiritual Guidance</h3>
          <p className="muted">Parish finder and resources.</p>
        </Link>
        <Link to="/liturgy-history" className="card stack">
          <h3>Liturgy and History</h3>
          <p className="muted">Mass, rites, year, and councils.</p>
        </Link>
        <Link to="/saints-our-lady" className="card stack">
          <h3>Saints and Our Lady</h3>
          <p className="muted">Canonized saints and approved apparitions.</p>
        </Link>
        <Link to="/search" className="card stack">
          <h3>Search</h3>
          <p className="muted">Global search across the library.</p>
        </Link>
      </div>
    </section>
  );
}
