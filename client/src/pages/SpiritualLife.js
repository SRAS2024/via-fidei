// client/src/pages/SpiritualLife.js
import React from "react";
import { useSearchParams } from "react-router-dom";
import { LocaleContext } from "../index";

export default function SpiritualLife() {
  const { locale } = React.useContext(LocaleContext);
  const [params, setParams] = useSearchParams();
  const focus = params.get("focus") || "";

  const [q, setQ] = React.useState(focusToQuery(focus));
  const [guides, setGuides] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [selected, setSelected] = React.useState(null); // full guide detail
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    if (q.trim()) runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale]);

  async function runSearch(e) {
    if (e) e.preventDefault();
    if (!q.trim()) {
      setGuides([]);
      setSelected(null);
      return;
    }
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      qs.set("q", q.trim());
      qs.set("type", "guide");
      if (locale) qs.set("locale", locale);

      const res = await fetch(`/api/search?${qs.toString()}`);
      const data = await res.json();
      const items = Array.isArray(data.results) ? data.results.filter((r) => r.type === "guide") : [];
      setGuides(items);
      setSelected(null);
    } catch {
      setGuides([]);
      setSelected(null);
    } finally {
      setLoading(false);
    }
  }

  async function openGuideBySlug(slug) {
    try {
      setBusy(true);
      const qs = new URLSearchParams();
      if (locale) qs.set("locale", locale);
      const res = await fetch(`/api/guides/${encodeURIComponent(slug)}?${qs.toString()}`);
      const data = await res.json();
      if (data?.slug) setSelected(data);
    } finally {
      setBusy(false);
    }
  }

  async function addAsGoal(guide) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/guides/${guide.id}/add-goal`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      await res.json();
      alert("Goal created from this guide");
    } finally {
      setBusy(false);
    }
  }

  async function saveGuide(guide) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    setBusy(true);
    try {
      await fetch(`/api/guides/${guide.id}/save`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Guide saved");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container stack-lg">
      <header className="card stack">
        <h1>Spiritual Life</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Step by step guides with clear checklists. Add a guide as a goal to track daily progress.
        </p>

        <QuickFilters onPick={(val) => { setQ(val); setParams(val ? { focus: val } : {}); }} />

        <form
          className="grid"
          style={{ gridTemplateColumns: "1fr auto", gap: 10 }}
          onSubmit={runSearch}
        >
          <label htmlFor="sl-q" className="sr-only">Search guides</label>
          <input
            id="sl-q"
            type="search"
            placeholder="Search guides like Rosary, Confession, Adoration, Consecration"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Search</button>
        </form>
      </header>

      {loading && (
        <div className="center"><div className="vf-loader" aria-label="Loading"></div></div>
      )}

      {!loading && (
        <div className="grid" style={{ gridTemplateColumns: "320px 1fr", gap: 16 }}>
          <aside className="card stack">
            <h3>Guides</h3>
            {guides.length === 0 && <p className="muted">No guides yet. Try a different search.</p>}
            <ul className="item-list">
              {guides.map((g) => {
                const title = g.locales?.[0]?.title || g.slug || "Guide";
                return (
                  <li key={g.id} className="item" style={{ display: "grid", gap: 6 }}>
                    <div style={{ fontWeight: 600 }}>{title}</div>
                    <div className="muted">Steps: {Array.isArray(g.steps) ? g.steps.length : "—"}</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => openGuideBySlug(g.slug)}
                      >
                        View
                      </button>
                      <button className="btn btn-primary" onClick={() => saveGuide(g)}>
                        Save
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>

          <section className="card stack">
            {!selected && (
              <EmptyState />
            )}

            {selected && (
              <GuideDetail guide={selected} busy={busy} onAddGoal={() => addAsGoal(selected)} />
            )}
          </section>
        </div>
      )}
    </section>
  );
}

function QuickFilters({ onPick }) {
  const filters = [
    { key: "rosary", label: "Rosary" },
    { key: "confession", label: "Confession" },
    { key: "adoration", label: "Adoration" },
    { key: "montfort", label: "Marian consecration" },
    { key: "joseph", label: "St Joseph consecration" },
    { key: "sacred-heart", label: "Sacred Heart" },
    { key: "ocia", label: "OCIA" },
  ];
  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      {filters.map((f) => (
        <button key={f.key} className="badge" type="button" onClick={() => onPick(f.key)}>
          {f.label}
        </button>
      ))}
      <button className="badge" type="button" onClick={() => onPick("")}>Clear</button>
    </div>
  );
}

function GuideDetail({ guide, onAddGoal, busy }) {
  const title = guide.locales?.[0]?.title || guide.slug || "Guide";
  const intro = guide.locales?.[0]?.introHtml || guide.introHtml || "";

  return (
    <>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <h2 style={{ margin: 0 }}>{title}</h2>
        <button className="btn btn-primary" onClick={onAddGoal} disabled={busy}>
          Add as Goal
        </button>
      </header>

      {intro && (
        <div dangerouslySetInnerHTML={{ __html: intro }} />
      )}

      <h3 className="mt-3">Steps</h3>
      <ol style={{ marginTop: 0 }}>
        {(guide.steps || []).map((s) => {
          const stitle = s.locales?.[0]?.title || s.slug || "Step";
          const body = s.locales?.[0]?.bodyHtml || s.bodyHtml || "";
          return (
            <li key={s.id} className="mt-2">
              <strong>{stitle}</strong>
              {body && (
                <div className="mt-1" dangerouslySetInnerHTML={{ __html: body }} />
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}

function EmptyState() {
  return (
    <div className="stack">
      <h3>Choose a guide</h3>
      <p className="muted">Pick a guide from the left or search above.</p>
    </div>
  );
}

function focusToQuery(focus) {
  switch (focus) {
    case "rosary": return "rosary";
    case "confession": return "confession";
    case "adoration": return "adoration";
    case "montfort": return "consecration to Jesus through Mary";
    case "joseph": return "consecration to St. Joseph";
    case "sacred-heart": return "sacred heart consecration";
    case "ocia": return "OCIA";
    default: return "";
  }
}
