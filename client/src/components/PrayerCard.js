// client/src/components/PrayerCard.js
import React from "react";

export default function PrayerCard({
  prayer,
  saved = false,
  onSave,
  onRemove,
}) {
  const title =
    prayer?.locales?.[0]?.title ||
    prayer?.title ||
    prayer?.slug ||
    "Untitled prayer";
  const snippet =
    stripHtml(
      prayer?.locales?.[0]?.bodyHtml ||
        prayer?.bodyHtml ||
        ""
    ).slice(0, 180) + (prayer?.locales?.[0]?.bodyHtml ? "..." : "");

  const [busy, setBusy] = React.useState(false);

  async function handleSave() {
    if (!onSave || busy) return;
    setBusy(true);
    try {
      await onSave(prayer);
    } finally {
      setBusy(false);
    }
  }
  async function handleRemove() {
    if (!onRemove || busy) return;
    setBusy(true);
    try {
      await onRemove(prayer);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card stack">
      <h3>{title}</h3>
      <p className="muted">{snippet}</p>
      <div className="right">
        {!saved ? (
          <button className="btn btn-primary" onClick={handleSave} disabled={busy}>
            Add to My Prayers
          </button>
        ) : (
          <button className="btn btn-danger" onClick={handleRemove} disabled={busy}>
            Remove
          </button>
        )}
      </div>
    </article>
  );
}

function stripHtml(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html || "";
  return tmp.textContent || tmp.innerText || "";
}
