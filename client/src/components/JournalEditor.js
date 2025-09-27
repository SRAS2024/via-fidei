// client/src/components/JournalEditor.js
import React from "react";
import PopupConfirm from "./PopupConfirm";

/**
 * JournalEditor
 * - Title and markdown body
 * - Save and Cancel
 * - Pencil for edit, trash for delete
 * - Optional onCreate, onUpdate, onDelete handlers
 */
export default function JournalEditor({
  entry,                 // { id, title, bodyMarkdown }
  onCreate,              // async ({ title, body }) => entry
  onUpdate,              // async (id, { title, body }) => entry
  onDelete,              // async (id) => void
}) {
  const isNew = !entry?.id;
  const [editing, setEditing] = React.useState(isNew);
  const [title, setTitle] = React.useState(entry?.title || "");
  const [body, setBody] = React.useState(entry?.bodyMarkdown || "");
  const [busy, setBusy] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);

  React.useEffect(() => {
    if (!editing && entry) {
      setTitle(entry.title || "");
      setBody(entry.bodyMarkdown || "");
    }
  }, [entry, editing]);

  async function handleSave() {
    if (!title.trim()) return;
    setBusy(true);
    try {
      if (isNew && onCreate) {
        await onCreate({ title: title.trim(), body });
      } else if (!isNew && onUpdate) {
        await onUpdate(entry.id, { title: title.trim(), body });
      }
      setEditing(false);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!entry?.id || !onDelete) return;
    setBusy(true);
    try {
      await onDelete(entry.id);
      setConfirmOpen(false);
    } finally {
      setBusy(false);
    }
  }

  if (!editing) {
    return (
      <article className="card stack">
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ margin: 0 }}>{entry?.title || "Untitled"}</h3>
          <div style={{ display: "flex", gap: 6 }}>
            <button
              type="button"
              className="icon-btn"
              title="Edit"
              aria-label="Edit"
              onClick={() => setEditing(true)}
            >
              <Pencil />
            </button>
            <button
              type="button"
              className="icon-btn"
              title="Delete"
              aria-label="Delete"
              onClick={() => setConfirmOpen(true)}
            >
              <Trash />
            </button>
          </div>
        </header>
        <div style={{ whiteSpace: "pre-wrap" }}>{entry?.bodyMarkdown || ""}</div>

        <PopupConfirm
          open={confirmOpen}
          title={`Delete “${entry?.title || "Untitled"}”?`}
          message="This cannot be undone."
          cancelLabel="Cancel"
          confirmLabel="Delete"
          confirmColor="red"
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleDelete}
        />
      </article>
    );
  }

  return (
    <article className="card stack">
      <div className="stack">
        <label htmlFor="je-title">Title</label>
        <input
          id="je-title"
          type="text"
          placeholder="Entry title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="stack">
        <label htmlFor="je-body">Notes</label>
        <textarea
          id="je-body"
          placeholder="Write from the heart"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </div>

      <div className="right" style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button className="btn btn-secondary" onClick={() => setEditing(false)} disabled={busy}>
          Cancel
        </button>
        <button className="btn btn-primary" onClick={handleSave} disabled={busy || !title.trim()}>
          Save
        </button>
      </div>
    </article>
  );
}

function Pencil() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25z" fill="currentColor" />
      <path d="M14.06 6.19l2.75 2.75 1.06-1.06a1.5 1.5 0 0 0 0-2.12l-.62-.62a1.5 1.5 0 0 0-2.12 0l-1.06 1.06z" fill="currentColor" />
    </svg>
  );
}

function Trash() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path d="M6 7h12l-1 13H7L6 7zM9 7V5h6v2" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </svg>
  );
}
