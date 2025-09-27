// client/src/components/Footer.js
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="vf-footer" role="contentinfo">
      <div className="vf-footer-inner">
        <div className="vf-footer-brand">
          <BrandMark />
          <span className="vf-footer-title">Via Fidei</span>
        </div>

        <nav aria-label="Footer">
          <ul className="vf-footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/prayers">Prayers</Link></li>
            <li><Link to="/saints-our-lady">Saints &amp; Our Lady</Link></li>
            <li><Link to="/spiritual-life">Spiritual Life</Link></li>
            <li><Link to="/spiritual-guidance">Spiritual Guidance</Link></li>
            <li><Link to="/liturgy-history">Liturgy and History</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/settings">Settings</Link></li>
          </ul>
        </nav>

        <div className="vf-footer-meta">
          <p className="muted">
            © {year} Via Fidei. All rights reserved.
          </p>
          <BackToTop />
        </div>
      </div>

      <style>
        {`
        .vf-footer {
          margin-top: 20px;
          border-top: 1px solid var(--vf-border, #e5e7eb);
          background: color-mix(in oklab, var(--vf-bg, #fff) 92%, transparent);
        }
        .vf-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 18px 16px 30px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 14px;
        }

        .vf-footer-brand {
          display: inline-flex;
          align-items: center;
          gap: 10px;
        }
        .vf-footer-title {
          font-weight: 700;
          font-size: var(--vf-font-lg, 1.125rem);
          letter-spacing: 0.02em;
        }

        .vf-footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 10px 14px;
          padding: 0;
          margin: 0;
          list-style: none;
        }
        .vf-footer-links a {
          color: inherit;
          text-decoration: none;
          padding: 6px 8px;
          border-radius: 10px;
        }
        .vf-footer-links a:hover,
        .vf-footer-links a:focus {
          text-decoration: underline;
          outline: none;
        }

        .vf-footer-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          flex-wrap: wrap;
        }

        @media (min-width: 900px) {
          .vf-footer-inner {
            grid-template-columns: 1fr auto 1fr;
            align-items: center;
          }
          .vf-footer-brand { justify-self: start; }
          .vf-footer-links { justify-self: center; }
          .vf-footer-meta { justify-self: end; }
        }
      `}
      </style>
    </footer>
  );
}

function BrandMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="22"
      height="22"
      aria-hidden="true"
      focusable="false"
    >
      <circle
        cx="12"
        cy="12"
        r="10.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 5.25v13.5M7.5 10.5h9"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BackToTop() {
  return (
    <button
      type="button"
      className="btn btn-ghost"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
    >
      ↑ Back to top
    </button>
  );
}
