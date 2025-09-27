// client/src/components/MilestoneTracker.js
import React from "react";
import PopupConfirm from "./PopupConfirm";

/**
 * MilestoneTracker
 * Three tiers:
 * - Sacraments
 * - Spiritual milestones
 * - Personal milestones
 */
export default function MilestoneTracker() {
  const [items, setItems] = React.useState([]);
  const [busy, setBusy] = React.useState(false);
  const [confirm, setConfirm] = React.useState({ open: false, id: null, title: "" });

  const grouped = React.useMemo(() => {
    const sacraments = items.filter((m) => m.type === "sacrament");
    const spiritual = items.filter((m) => m.type === "spiritual");
    const personal = items.filter((m) => m.type === "personal");
    return { sacraments, spiritual, personal };
  }, [items]);

  React.useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/profile/milestones", auth());
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    }
  }

  async function addMilestone(type, title, description, iconKey) {
    setBusy(true);
    try {
      // Prevent duplicates for sacraments and spiritual
      const exists =
        (type === "sacrament" || type === "spiritual") &&
        items.some((m) => m.type === type && m.title === title);
      if (exists) return;

      const res = await fetch("/api/profile/milestones", {
        ...auth(),
        method: "POST",
        headers: { "Content-Type": "application/json", ...(auth().headers || {}) },
        body: JSON.stringify({ type, title, description, iconKey }),
      });
      const data = await res.json();
      if (!data?.id) return;
      setItems((prev) => [data, ...prev]);
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`/api/profile/milestones/${id}`, {
        ...auth(),
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(auth().headers || {}) },
        body: JSON.stringify({ status, completedAt: status === "completed" ? new Date().toISOString() : null }),
      });
      const data = await res.json();
      setItems((prev) => prev.map((m) => (m.id === id ? data : m)));
    } catch { /* ignore */ }
  }

  async function removeMilestone() {
    const id = confirm.id;
    if (!id) return;
    try {
      await fetch(`/api/profile/milestones/${id}`, { ...auth(), method: "DELETE" });
      setItems((prev) => prev.filter((m) => m.id !== id));
    } finally {
      setConfirm({ open: false, id: null, title: "" });
    }
  }

  return (
    <section className="stack-lg">
      <Tier
        title="Sacraments"
        items={grouped.sacraments}
        onAdd={() => openSacraments(addMilestone)}
        onStatus={updateStatus}
        onRemove={(m) => setConfirm({ open: true, id: m.id, title: m.title })}
        busy={busy}
      />
      <Tier
        title="Spiritual Milestones"
        items={grouped.spiritual}
        onAdd={() => openSpiritual(addMilestone)}
        onStatus={updateStatus}
        onRemove={(m) => setConfirm({ open: true, id: m.id, title: m.title })}
        busy={busy}
      />
      <Tier
        title="Personal Milestones"
        items={grouped.personal}
        onAdd={() => openPersonal(addMilestone)}
        onStatus={updateStatus}
        onRemove={(m) => setConfirm({ open: true, id: m.id, title: m.title })}
        busy={busy}
      />

      <PopupConfirm
        open={confirm.open}
        title={`Remove “${confirm.title}” from your milestones?`}
        cancelLabel="Cancel"
        confirmLabel="Remove"
        confirmColor="red"
        onCancel={() => setConfirm({ open: false, id: null, title: "" })}
        onConfirm={removeMilestone}
      />
    </section>
  );
}

function Tier({ title, items, onAdd, onStatus, onRemove, busy }) {
  return (
    <div className="card stack">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>{title}</h3>
        <button className="icon-btn" onClick={onAdd} disabled={busy} aria-label={`Add to ${title}`}>
          <Plus />
        </button>
      </div>

      <div className="item-list">
        {items.length === 0 && <p className="muted">No items yet.</p>}
        {items.map((m) => (
          <MilestoneItem key={m.id} item={m} onStatus={onStatus} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
}

function MilestoneItem({ item, onStatus, onRemove }) {
  const status = item.status || "planned";
  return (
    <div className="item" style={{ display: "grid", gridTemplateColumns: "1fr auto", alignItems: "center" }}>
      <div>
        <strong>{item.title}</strong>
        {item.description ? <div className="muted">{item.description}</div> : null}
        <div className="muted" style={{ marginTop: 6 }}>Status: {status.replace("_", " ")}</div>
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {status !== "completed" && (
          <button className="btn btn-primary" onClick={() => onStatus(item.id, "completed")}>Mark Complete</button>
        )}
        {status === "completed" && (
          <button className="btn btn-ghost" onClick={() => onStatus(item.id, "planned")}>Mark Not Complete</button>
        )}
        <button className="btn btn-danger" onClick={() => onRemove(item)}>Remove</button>
      </div>
    </div>
  );
}

function openSacraments(add) {
  const options = [
    { title: "Baptism", iconKey: "chalice" },
    { title: "Eucharist", iconKey: "chalice-gold" },
    { title: "Confirmation", iconKey: "dove" },
    { title: "Reconciliation", iconKey: "keys" },
    { title: "Anointing of the Sick", iconKey: "oil" },
    { title: "Holy Orders", iconKey: "stole" },
    { title: "Matrimony", iconKey: "rings" },
  ];
  pickFromList("Add sacrament", options, (opt) => add("sacrament", opt.title, "", opt.iconKey));
}

function openSpiritual(add) {
  const options = [
    { title: "Consecration to Jesus through Mary", iconKey: "mary" },
    { title: "Consecration to St. Joseph", iconKey: "joseph" },
    { title: "Sacred Heart Consecration", iconKey: "sacred-heart" },
    { title: "Retreat", iconKey: "book" },
  ];
  pickFromList("Add spiritual milestone", options, (opt) => add("spiritual", opt.title, "", opt.iconKey));
}

function openPersonal(add) {
  const title = prompt("New personal milestone title");
  if (title && title.trim()) {
    add("personal", title.trim(), "", "star");
  }
}

function pickFromList(title, options, onPick) {
  const labels = options.map((o, i) => `${i + 1}. ${o.title}`).join("\n");
  const val = prompt(`${title}\n\n${labels}\n\nType a number`);
  const idx = Number(val) - 1;
  if (!isNaN(idx) && idx >= 0 && idx < options.length) onPick(options[idx]);
}

function Plus() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function auth() {
  const token = localStorage.getItem("vf_token");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
}
