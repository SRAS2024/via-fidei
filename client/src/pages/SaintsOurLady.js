// client/src/pages/SaintsOurLady.js
import React from "react";
import SaintCard from "../components/SaintCard";
import OurLadyCard from "../components/OurLadyCard";
import Pagination from "../components/Pagination";
import { LocaleContext } from "../index";

export default function SaintsOurLady() {
  const { locale } = React.useContext(LocaleContext);
  const [tab, setTab] = React.useState("saints"); // saints or ourlady
  const [q, setQ] = React.useState("");
  const [month, setMonth] = React.useState(""); // YYYY-MM
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const perPage = 12;

  React.useEffect(() => {
    search();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, locale]);

  async function search() {
    setLoading(true);
    try {
      const base = tab === "saints" ? "/api/saints" : "/api/ourladies";
      const params = new URLSearchParams();
      if (q.trim()) params.set("query", q.trim());
      if (month) params.set("feastMonth", month);
      if (locale) params.set("locale", locale);

      const res = await fetch(`${base}?${params.toString()}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
      setPage(1);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function onSave(entity) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    const id = entity.id;
    const path = tab === "saints" ? `/api/saints/${id}/save` : `/api/ourladies/${id}/save`;
    await fetch(path, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
  }

  async function onRemove(entity) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    const id = entity.id;
    const path = tab === "saints" ? `/api/saints/${id}/remove` : `/api/ourladies/${id}/remove`;
    await fetch(path, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  }

  const shown = React.useMemo(() => {
    const start = (page - 1) * perPage;
    return items.slice(start, start + perPage);
  }, [items, page]);

  return (
    <section className="container stack-lg">
      <header className="card stack">
        <h1>Saints and Our Lady</h1>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            className={`btn ${tab === "saints" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("saints")}
          >
            Saints
          </button>
          <button
            className={`btn ${tab === "ourlady" ? "btn-primary" : "btn-ghost"}`}
            onClick={() => setTab("ourlady")}
          >
            Our Lady
          </button>
        </div>

        <form
          className="grid"
          style={{ gridTemplateColumns: "1fr 180px auto auto", gap: 10 }}
          onSubmit={(e) => {
            e.preventDefault();
            search();
          }}
        >
          <label className="sr-only" htmlFor="sl-q">Search</label>
          <input
            id="sl-q"
            type="search"
            placeholder={tab === "saints" ? "Search saints" : "Search apparitions"}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <label className="sr-only" htmlFor="sl-month">Feast month</label>
          <input
            id="sl-month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => { setQ(""); setMonth(""); }}
          >
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
            {tab === "saints" &&
              shown.map((s) => (
                <SaintCard key={s.id} saint={s} onSave={onSave} onRemove={onRemove} />
              ))}
            {tab === "ourlady" &&
              shown.map((o) => (
                <OurLadyCard key={o.id} apparition={o} onSave={onSave} onRemove={onRemove} />
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
