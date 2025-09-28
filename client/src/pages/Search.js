// client/src/pages/Search.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PrayerCard from "../components/PrayerCard";
import SaintCard from "../components/SaintCard";
import OurLadyCard from "../components/OurLadyCard";
import Pagination from "../components/Pagination";
import { LocaleContext } from "../index";

export default function Search() {
  const { locale } = React.useContext(LocaleContext);
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = React.useMemo(() => new URLSearchParams(search), [search]);

  const [q, setQ] = React.useState(params.get("q") || "");
  const [type, setType] = React.useState(params.get("type") || "all");
  const [results, setResults] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 12;

  React.useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  async function runSearch() {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("q", q.trim());
      if (type && type !== "all") qs.set("type", type);
      if (locale) qs.set("locale", locale);

      const res = await fetch(`/api/search?${qs.toString()}`);
      const data = await res.json();
      setResults(Array.isArray(data.results) ? data.results : []);
      setPage(1);
      navigate(`/search?${qs.toString()}`, { replace: true });
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveEntity(entity) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    const id = entity.id;
    if (entity.type === "prayer") {
      await fetch(`/api/prayers/${id}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } else if (entity.type === "saint") {
      await fetch(`/api/saints/${id}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } else if (entity.type === "ourlady") {
      await fetch(`/api/ourladies/${id}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } else if (entity.type === "guide") {
      await fetch(`/api/guides/${id}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    } else if (entity.type === "parish") {
      await fetch(`/api/parishes/${id}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    }
  }

  const filtered = React.useMemo(() => {
    return type === "all" ? results : results.filter((r) => r.type === type);
  }, [results, type]);

  const shown = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  return (
    <section className="container stack-lg">
      <header className="card stack">
        <h1>Search</h1>
        <form
          className="grid"
          style={{ gridTemplateColumns: "1fr 180px auto", gap: 10 }}
          onSubmit={(e) => {
            e.preventDefault();
            runSearch();
          }}
        >
          <label className="sr-only" htmlFor="s-q">Search</label>
          <input
            id="s-q"
            type="search"
            placeholder="Search across all content"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="sr-only" htmlFor="s-type">Type</label>
          <select
            id="s-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All types</option>
            <option value="prayer">Prayers</option>
            <option value="saint">Saints</option>
            <option value="ourlady">Our Lady</option>
            <option value="guide">Guides</option>
            <option value="parish">Parishes</option>
          </select>
          <button className="btn btn-primary" type="submit">Search</button>
        </form>
      </header>

      {loading && (
        <div className="center"><div className="vf-loader" aria-label="Loading"></div></div>
      )}

      {!loading && shown.length === 0 && q.trim() && (
        <div className="card">
          <p className="muted">No results. Try a different query or type filter.</p>
        </div>
      )}

      {!loading && shown.length > 0 && (
        <>
          <div className="grid grid-3">
            {shown.map((r) => {
              if (r.type === "prayer") {
                return <PrayerCard key={`p-${r.id}`} prayer={r} onSave={saveEntity} />;
              }
              if (r.type === "saint") {
                return <SaintCard key={`s-${r.id}`} saint={r} onSave={saveEntity} />;
              }
              if (r.type === "ourlady") {
                return <OurLadyCard key={`o-${r.id}`} apparition={r} onSave={saveEntity} />;
              }
              return (
                <article key={`${r.type}-${r.id}`} className="card stack">
                  <h3>{labelFor(r)}</h3>
                  <p className="muted">{subtitleFor(r)}</p>
                  <div className="right">
                    <button className="btn btn-primary" onClick={() => saveEntity(r)}>Save</button>
                  </div>
                </article>
              );
            })}
          </div>
          <Pagination
            page={page}
            perPage={perPage}
            total={filtered.length}
            onChange={setPage}
          />
        </>
      )}
    </section>
  );
}

function labelFor(r) {
  return (
    r?.locales?.[0]?.title ||
    r?.locales?.[0]?.name ||
    r?.name ||
    r?.slug ||
    "Untitled"
  );
}
function subtitleFor(r) {
  if (r.type === "parish") {
    const parts = [r.city, r.region, r.country].filter(Boolean);
    return parts.join(", ");
  }
  if (r.type === "guide") {
    return "Guide";
  }
  return r.type ? r.type[0].toUpperCase() + r.type.slice(1) : "";
}
