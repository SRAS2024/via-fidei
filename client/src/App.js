// client/src/App.js
import React, { Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

// Layout components to be created next
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import LanguageSelector from "./components/LanguageSelector";
import SearchBar from "./components/SearchBar";

// Pages to be implemented next
const Home = React.lazy(() => import("./pages/Home"));
const Prayers = React.lazy(() => import("./pages/Prayers"));
const SpiritualLife = React.lazy(() => import("./pages/SpiritualLife"));
const SpiritualGuidance = React.lazy(() => import("./pages/SpiritualGuidance"));
const LiturgyHistory = React.lazy(() => import("./pages/LiturgyHistory"));
const SaintsOurLady = React.lazy(() => import("./pages/SaintsOurLady"));
const Search = React.lazy(() => import("./pages/Search"));
const Profile = React.lazy(() => import("./pages/Profile"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Login = React.lazy(() => import("./pages/Login"));
const Register = React.lazy(() => import("./pages/Register"));
const ForgotPassword = React.lazy(() => import("./pages/ForgotPassword"));

function Loader() {
  return (
    <div className="vf-loader-wrap" role="status" aria-live="polite">
      <div className="vf-loader" />
      <span className="vf-loader-text">Loading</span>
      <style>
        {`
        .vf-loader-wrap {
          display: grid;
          place-items: center;
          min-height: 40vh;
          gap: 10px;
        }
        .vf-loader {
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          border: 2px solid rgba(0,0,0,0.15);
          border-top-color: #2563eb;
          animation: vf-spin 1s linear infinite;
        }
        .vf-loader-text {
          font-size: 0.95rem;
          color: var(--vf-fg-muted, #666666);
        }
        @keyframes vf-spin { to { transform: rotate(360deg); } }
      `}
      </style>
    </div>
  );
}

/**
 * Scroll to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname]);
  return null;
}

/**
 * Very small auth gate using localStorage token
 * Later we can replace with a full AuthProvider if desired
 */
function PrivateRoute({ children }) {
  const token = typeof window !== "undefined" ? localStorage.getItem("vf_token") : null;
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

/**
 * App layout
 * Centered header, balanced navigation, always visible language selector and search
 */
export default function App() {
  return (
    <div className="vf-app">
      <SkipLink />
      <header className="vf-header" role="banner">
        <div className="vf-header-inner">
          <Header />
          <nav aria-label="Primary">
            <Navigation />
          </nav>
          <div className="vf-header-tools" aria-label="Utilities">
            <LanguageSelector />
            <SearchBar compact />
          </div>
        </div>
      </header>

      <main id="main" className="vf-main" role="main">
        <ScrollToTop />
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/prayers" element={<Prayers />} />
            <Route path="/spiritual-life" element={<SpiritualLife />} />
            <Route path="/spiritual-guidance" element={<SpiritualGuidance />} />
            <Route path="/liturgy-history" element={<LiturgyHistory />} />
            <Route path="/saints-our-lady" element={<SaintsOurLady />} />
            <Route path="/search" element={<Search />} />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />

      <style>
        {`
        .vf-app {
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto 1fr auto;
          background: var(--vf-bg, #ffffff);
          color: var(--vf-fg, #111111);
        }

        .vf-header {
          border-bottom: 1px solid color-mix(in oklab, var(--vf-fg, #111) 12%, transparent);
          position: sticky;
          top: 0;
          z-index: 50;
          backdrop-filter: saturate(180%) blur(6px);
          background: color-mix(in oklab, var(--vf-bg, #fff) 86%, transparent);
        }

        .vf-header-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: 16px;
          align-items: center;
          padding: 12px 16px;
        }

        .vf-header-inner > nav {
          justify-self: center;
        }

        .vf-header-tools {
          justify-self: end;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .vf-main {
          max-width: 1200px;
          width: 100%;
          margin: 0 auto;
          padding: 20px 16px 40px;
        }
      `}
      </style>
    </div>
  );
}

/**
 * Simple not found page
 */
function NotFound() {
  return (
    <div className="vf-notfound">
      <h1>Page not found</h1>
      <p>Return to the Home page or try Search.</p>
      <style>
        {`
        .vf-notfound {
          text-align: center;
          padding: 60px 0;
        }
      `}
      </style>
    </div>
  );
}

/**
 * Skip link for keyboard users
 */
function SkipLink() {
  return (
    <a className="vf-skip" href="#main">
      Skip to main content
      <style>
        {`
        .vf-skip {
          position: absolute;
          top: -40px;
          left: 8px;
          background: #ffffff;
          color: #111111;
          padding: 8px 12px;
          border-radius: 10px;
          border: 1px solid color-mix(in oklab, #111111 14%, transparent);
          transition: top 0.2s ease;
          z-index: 100;
        }
        .vf-skip:focus {
          top: 8px;
          outline: none;
        }
      `}
      </style>
    </a>
  );
}
