// client/src/components/PopupConfirm.js
import React from "react";

export default function PopupConfirm({
  open,
  title,
  message,
  cancelLabel = "Cancel",
  confirmLabel = "Remove",
  confirmColor = "red", // red or blue
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="popup-overlay" role="dialog" aria-modal="true" aria-labelledby="pc-title">
      <div className="popup-card">
        <h3 id="pc-title" style={{ marginTop: 0 }}>{title}</h3>
        {message && <p className="muted" style={{ marginTop: 6 }}>{message}</p>}
        <div className="popup-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`btn ${confirmColor === "blue" ? "btn-primary" : "btn-danger"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
