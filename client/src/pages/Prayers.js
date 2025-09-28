// client/src/pages/Prayers.js
import React from "react";
import PrayerCard from "../components/PrayerCard";
import Pagination from "../components/Pagination";
import { LocaleContext } from "../index";

export default function Prayers() {
  const { locale } = React.useContext(LocaleContext);
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 12;

  React.useEffect(() => {
    fetchPrayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, category]);

  async function fetchPrayers() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("query", query.trim());
      if (category) params.set("category", category);
      params.set("locale", locale || "en");

      const res = await fetch(`/api/prayers?${params.toString()}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setPage(1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(prayer) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    await fetch(`/api/prayers/${prayer.id}/save`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  async function handleRemove(prayer) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    await fetch(`/api/prayers/${prayer.id}/remove`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  const shown = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page]);

  return (
    <section className="container stack-lg">
      <header className="card stack">
        <h1>Prayers</h1>
        <form
          className="grid"
          style={{ gridTemplateColumns: "1fr 220px 120px auto", gap: 10 }}
          onSubmit={(e) => {
            e.preventDefault();
            fetchPrayers();
          }}
        >
          <label className="sr-only" htmlFor="p-q">Search prayers</label>
          <input
            id="p-q"
            type="search"
            placeholder="Search prayers"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="sr-only" htmlFor="p-cat">Category</label>
          <select
            id="p-cat"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All categories</option>
            <option value="marian">Marian</option>
            <option value="christ">Christ-centered</option>
            <option value="angelic">Angelic</option>
            <option value="sacramental">Sacramental</option>
            <option value="seasonal">Seasonal</option>
            <option value="devotions">Devotions</option>
            <option value="daily">Daily</option>
          </select>
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setQuery(""); setCategory(""); }}>
            Clear
          </button>
        </form>
      </header>

      {loading && (
        <div className="center"><div className="vf-loader" aria-label="Loading"></div></div>
      )}

      {!loading && (
        <>
          <div className="grid grid-3">
            {shown.map((p) => (
              <PrayerCard key={p.id} prayer={p} onSave={handleSave} onRemove={handleRemove} />
            ))}
          </div>
          <Pagination
            page={page}
            perPage={perPage}
            total={items.length}
            onChange={setPage}
          />
        </>
      )}
    </section>
  );
}
