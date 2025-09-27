// client/src/components/OurLadyCard.js
import React from "react";

export default function OurLadyCard({
  apparition,
  saved = false,
  onSave,
  onRemove,
}) {
  const name =
    apparition?.locales?.[0]?.name ||
    apparition?.title ||
    apparition?.slug ||
    "Our Lady";
  const bio =
    stripHtml(
      apparition?.locales?.[0]?.biographyHtml ||
        apparition?.biographyHtml ||
        ""
    ).slice(0, 180) + (apparition?.locales?.[0]?.biographyHtml ? "..." : "");

  const [busy, setBusy] = React.useState(false);

  async function handleSave() {
    if (!onSave || busy) return;
    setBusy(true);
    try {
      await onSave(apparition);
    } finally {
      setBusy(false);
    }
  }
  async function handleRemove() {
    if (!onRemove || busy) return;
    setBusy(true);
    try {
      await onRemove(apparition);
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
