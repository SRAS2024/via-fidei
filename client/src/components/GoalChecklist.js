// client/src/components/GoalChecklist.js
import React from "react";

/**
 * GoalChecklist
 * - Renders goal days with checklist
 * - Toggle completion per day
 */
export default function GoalChecklist({ goal }) {
  const [days, setDays] = React.useState(goal?.days || []);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => setDays(goal?.days || []), [goal]);

  async function toggleDay(dayNumber) {
    if (!goal?.id) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/profile/goals/${goal.id}/days/${dayNumber}/toggle`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(auth().headers || {}),
        },
        ...auth(),
      });
      const data = await res.json();
      setDays((prev) => prev.map((d) => (d.id === data.id ? data : d)));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card stack">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ margin: 0 }}>{goal?.title || "Goal"}</h3>
        <StatusPill status={goal?.status} />
      </header>

      <ul className="item-list">
        {days
          .sort((a, b) => a.dayNumber - b.dayNumber)
          .map((d) => {
            const list = Array.isArray(d.checklistJson) ? d.checklistJson : [];
            return (
              <li key={d.id} className="item" style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <strong>Day {d.dayNumber}</strong>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                    <input
                      type="checkbox"
                      checked={Boolean(d.isCompleted)}
                      onChange={() => toggleDay(d.dayNumber)}
                      disabled={busy}
                    />
                    <span className="muted">{d.isCompleted ? "Completed" : "Not completed"}</span>
                  </label>
                </div>

                {list.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {list.map((item, idx) => (
                      <li key={idx} className="muted">{String(item)}</li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
      </ul>
    </div>
  );
}

function StatusPill({ status }) {
  if (!status) return null;
  const text = status === "in_progress" ? "In progress" : status[0].toUpperCase() + status.slice(1);
  return <span className="badge">{text}</span>;
}

function auth() {
  const token = localStorage.getItem("vf_token");
  return token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
}
