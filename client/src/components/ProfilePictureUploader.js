// client/src/components/ProfilePictureUploader.js
import React from "react";

export default function ProfilePictureUploader({
  src,
  alt = "Profile picture",
  onSelect, // async function(file) => returns uploaded URL or data URL
  tooltip = "Edit Profile Picture",
}) {
  const [preview, setPreview] = React.useState(src || "");
  const [open, setOpen] = React.useState(false);
  const fileRef = React.useRef(null);
  const cameraRef = React.useRef(null);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => setPreview(src || ""), [src]);

  async function handleFiles(files) {
    if (!files || !files[0]) return;
    const file = files[0];

    try {
      setBusy(true);
      let url = "";
      if (onSelect) {
        url = await onSelect(file);
      } else {
        // fallback to local preview
        url = await fileToDataUrl(file);
      }
      setPreview(url);
      setOpen(false);
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
      if (cameraRef.current) cameraRef.current.value = "";
    }
  }

  return (
    <div className="avatar-wrap">
      <img src={preview} alt={alt} className="avatar" />
      <button
        type="button"
        className="avatar-edit"
        title={tooltip}
        aria-label={tooltip}
        onClick={() => setOpen(true)}
      >
        <Pencil />
      </button>

      {open && (
        <div className="popup-overlay" role="dialog" aria-modal="true" aria-labelledby="ppu-title">
          <div className="popup-card">
            <h3 id="ppu-title" style={{ marginTop: 0 }}>Update profile picture</h3>
            <div className="stack">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => cameraRef.current?.click()}
              >
                Take Photo
              </button>
              <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => fileRef.current?.click()}
              >
                Choose from Library
              </button>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>

            <div className="popup-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setOpen(false)}>
                Cancel
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setOpen(false)} disabled={busy}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Pencil() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
      <path
        d="M4 17.25V20h2.75L17.81 8.94l-2.75-2.75L4 17.25z"
        fill="currentColor"
      />
      <path
        d="M14.06 6.19l2.75 2.75 1.06-1.06a1.5 1.5 0 0 0 0-2.12l-.62-.62a1.5 1.5 0 0 0-2.12 0l-1.06 1.06z"
        fill="currentColor"
      />
    </svg>
  );
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
