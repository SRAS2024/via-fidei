// client/src/components/SearchBar.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { LocaleContext } from "../index";

const TYPE_LABELS = {
  prayer: "Prayers",
  saint: "Saints",
  ourlady: "Our Lady",
  guide: "Guides",
  parish: "Parishes",
};

export default function SearchBar({ compact = false }) {
  const navigate = useNavigate();
  const { locale } = React.useContext(LocaleContext);
  const [q, setQ] = React.useState("");
  const [type, setType] = React.useState("all");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const abortRef = React.useRef(null);
  const boxRef = React.useRef(null);

  React.useEffect(() => {
    function onDocClick(e) {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // Debounced search
  React.useEffect(() => {
    if (!q || q.trim().length < 2) {
      setResults([]);
      return;
    }

    const handler = setTimeout(async () => {
      try {
        if (abortRef.current) abortRef.current.abort();
        abortRef.current = new AbortController();

        setLoading(true);
        const params = new URLSearchParams();
        params.set("q", q.trim());
        if (locale) params.set("locale", locale);
        if (type !== "all") params.set("type", type);

        const res = await fetch(`/api/search?${params.toString()}`, {
          signal: abortRef.current.signal,
        });
        const data = await res.json();
        setResults(Array.isArray(data.results) ? data.results : []);
        setOpen(true);
      } catch (err) {
        if (err.name !== "AbortError") {
          // fail silently in UI, could log if needed
        }
      } finally {
        setLoading(false);
      }
    }, 220);

    return () => clearTimeout(handler);
  }, [q, type, locale]);

  function onSubmit(e) {
    e.preventDefault();
    if (!q.trim()) return;
    const params = new URLSearchParams();
    params.set("q", q.trim());
    if (locale) params.set("locale", locale);
    if (type !== "all") params.set("type", type);
    navigate(`/search?${params.toString()}`);
    setOpen(false);
  }

  const grouped = React.useMemo(() => {
    const map = new Map();
    for (const item of results) {
      const key = item.type || "other";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(item);
    }
    return Array.from(map.entries());
  }, [results]);

  return (
    <div
      className={`search ${compact ? "search-compact" : ""}`}
      ref={boxRef}
      role="search"
      aria-label="Global search"
    >
      <form onSubmit={onSubmit} className="search-form" autoComplete="off">
        <label htmlFor="vf-search" className="sr-only">
          Search
        </label>
        <input
          id="vf-search"
          type="search"
          inputMode="search"
          placeholder="Search prayers, saints, Our Lady, guides, parishes"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          aria-autocomplete="list"
          aria-expanded={open}
          aria-controls="vf-search-listbox"
        />

        <label htmlFor="vf-type" className="sr-only">
          Filter by type
        </label>
        <select
          id="vf-type"
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label="Filter by type"
        >
          <option value="all">All</option>
          <option value="prayer">Prayers</option>
          <option value="saint">Saints</option>
          <option value="ourlady">Our Lady</option>
          <option value="guide">Guides</option>
          <option value="parish">Parishes</option>
        </select>

        <button type="submit" className="icon-btn" aria-label="Search">
          <Magnifier />
        </button>
      </form>

      {open && (loading || grouped.length > 0) && (
        <div
          id="vf-search-listbox"
          className="vf-search-panel card shadow-md"
          role="listbox"
          aria-label="Search suggestions"
        >
          {loading && (
            <div className="pad center">
              <div className="vf-loader" aria-label="Loading"></div>
            </div>
          )}

          {!loading &&
            grouped.map(([group, items]) => (
              <div key={group} className="vf-search-group">
                <div className="vf-search-group-title">
                  {TYPE_LABELS[group] || group}
                </div>
                <ul className="vf-search-items">
                  {items.slice(0, 5).map((item) => {
                    const title =
                      item.locales?.[0]?.title ||
                      item.locales?.[0]?.name ||
                      item.name ||
                      item.slug ||
                      "Untitled";
                    return (
                      <li key={`${group}-${item.id || item.slug}`}>
                        <button
                          type="button"
                          className="vf-search-item"
                          onClick={() => {
                            const params = new URLSearchParams();
                            params.set("q", title);
                            if (locale) params.set("locale", locale);
                            params.set("type", group);
                            navigate(`/search?${params.toString()}`);
                            setOpen(false);
                          }}
                        >
                          <span className="vf-search-item-title">{title}</span>
                          <span className="vf-search-item-type">
                            {TYPE_LABELS[group] || group}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
        </div>
      )}

      <style>
        {`
        .search {
          position: relative;
          min-width: 340px;
        }
        .search-compact {
          min-width: 260px;
        }
        .search-form {
          display: grid;
          grid-template-columns: 1fr auto auto;
          gap: 8px;
        }
        .vf-search-panel {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: min(640px, 92vw);
          z-index: 60;
        }
        .vf-search-group { padding: 10px 10px 6px; }
        .vf-search-group + .vf-search-group { border-top: 1px solid var(--vf-border); }
        .vf-search-group-title {
          font-size: var(--vf-font-sm);
          color: var(--vf-fg-muted);
          margin: 2px 6px 8px;
        }
        .vf-search-items {
          display: grid;
          gap: 6px;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .vf-search-item {
          width: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid var(--vf-border);
          border-radius: var(--vf-radius-md);
          background: var(--vf-surface);
          cursor: pointer;
          text-align: left;
        }
        .vf-search-item:hover,
        .vf-search-item:focus {
          outline: none;
          border-color: color-mix(in oklab, var(--vf-blue) 40%, transparent);
          box-shadow: var(--vf-focus-ring);
        }
        .vf-search-item-title { font-weight: 600; }
        .vf-search-item-type { font-size: var(--vf-font-xs); color: var(--vf-fg-muted); }
      `}
      </style>
    </div>
  );
}

function Magnifier() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
