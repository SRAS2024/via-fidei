// client/src/components/Navigation.js
import React from "react";
import { NavLink } from "react-router-dom";

/**
 * Primary navigation
 * Order:
 * 1. Home
 * 2. Prayers
 * 3. Spiritual Life
 * 4. Spiritual Guidance
 * 5. Liturgy and History
 * 6. Saints & Our Lady
 * Search and Login live on the far right in the header tools
 */
export default function Navigation() {
  return (
    <ul className="nav vf-nav" aria-label="Primary navigation">
      <NavItem to="/">Home</NavItem>
      <NavItem to="/prayers">Prayers</NavItem>
      <NavItem to="/spiritual-life">Spiritual Life</NavItem>
      <NavItem to="/spiritual-guidance">Spiritual Guidance</NavItem>
      <NavItem to="/liturgy-history">Liturgy and History</NavItem>
      <NavItem to="/saints-our-lady">Saints &amp; Our Lady</NavItem>

      <style>
        {`
        .vf-nav {
          font-size: var(--vf-font-lg, 1.125rem);
          gap: 18px;
        }
        .vf-nav a {
          padding: 10px 12px;
        }
        @media (max-width: 900px) {
          .vf-nav {
            font-size: var(--vf-font-base, 1rem);
            gap: 12px;
          }
          .vf-nav a {
            padding: 8px 10px;
          }
        }
      `}
      </style>
    </ul>
  );
}

function NavItem({ to, children }) {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) => (isActive ? "active" : undefined)}
        aria-current={({ isActive }) => (isActive ? "page" : undefined)}
      >
        {children}
      </NavLink>
    </li>
  );
}
