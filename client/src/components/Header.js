// client/src/components/Header.js
import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="vf-brand">
      <Link to="/" className="vf-brand-link" aria-label="Via Fidei, go to Home">
        <BrandMark />
        <span className="vf-brand-text">Via Fidei</span>
      </Link>

      <style>
        {`
        .vf-brand {
          display: flex;
          align-items: center;
        }
        .vf-brand-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 6px 8px;
          border-radius: 12px;
          color: inherit;
          text-decoration: none;
        }
        .vf-brand-link:hover,
        .vf-brand-link:focus {
          background: color-mix(in oklab, var(--vf-fg, #111) 6%, transparent);
          outline: none;
        }
        .vf-brand-text {
          font-size: var(--vf-font-xl, 1.375rem);
          font-weight: 700;
          letter-spacing: 0.02em;
        }
      `}
      </style>
    </div>
  );
}

function BrandMark() {
  return (
    <svg
      className="vf-logo"
      viewBox="0 0 24 24"
      width="28"
      height="28"
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
      {/* Cross */}
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
