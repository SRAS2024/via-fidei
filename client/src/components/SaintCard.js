// client/src/components/SaintCard.js
import React from "react";

export default function SaintCard({
  saint,
  saved = false,
  onSave,
  onRemove,
}) {
  const name =
    saint?.locales?.[0]?.name || saint?.name || saint?.slug || "Unnamed saint";
  const bio =
    stripHtml(
      saint?.locales?.[0]?.biographyHtml || saint?.biographyHtml || ""
    ).slice(0, 180) + (saint?.locales?.[0]?.biographyHtml ? "..." : "");

  const [busy, setBusy] = React.useState(false);

  async function handleSave() {
    if (!onSave || busy) return;
    setBusy(true);
    try {
      await onSave(saint);
    } finally {
      setBusy(false);
    }
  }
  async function handleRemove() {
    if (!onRemove || busy) return;
    setBusy(true);
    try {
      await onRemove(saint);
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className="card stack">
      <h3>{name}</h3>
      <p className="muted">{bio}</p>
      <div className="right">
        {!saved ? (
          <button className="btn btn-primary" onClick={handleSave} disabled={busy}>
            Save
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
