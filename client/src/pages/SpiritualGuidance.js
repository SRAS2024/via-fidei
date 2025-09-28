// client/src/pages/SpiritualGuidance.js
import React from "react";

export default function SpiritualGuidance() {
  const [city, setCity] = React.useState("");
  const [postal, setPostal] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [coords, setCoords] = React.useState(null);
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  async function geoLocate() {
    if (!navigator.geolocation) {
      alert("Geolocation is not available in your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        await runSearch({ lat: latitude, lng: longitude, country });
      },
      () => alert("Could not get your location"),
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 }
    );
  }

  async function runSearch(opts) {
    setLoading(true);
    try {
      const o = opts || {};
      const qs = new URLSearchParams();
      if (o.lat && o.lng) {
        qs.set("lat", String(o.lat));
        qs.set("lng", String(o.lng));
        if (o.country) qs.set("country", o.country);
      } else {
        if (city.trim()) qs.set("city", city.trim());
        if (postal.trim()) qs.set("postal", postal.trim());
        if (country.trim()) qs.set("country", country.trim());
      }
      const res = await fetch(`/api/parishes?${qs.toString()}`);
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function saveParish(p) {
    const token = localStorage.getItem("vf_token");
    if (!token) {
      window.location.assign("/login");
      return;
    }
    await fetch(`/api/parishes/${p.id}/save`, { method: "POST", headers: { Authorization: `Bearer ${token}` } });
    alert("Parish saved to your profile");
  }

  return (
    <section className="container stack-lg">
      <header className="card stack">
        <h1>Spiritual Guidance</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          Find a parish near you. Use your location or search by city or postal code.
        </p>
        <div className="grid" style={{ gridTemplateColumns: "1fr 1fr 120px auto", gap: 10 }}>
          <label className="sr-only" htmlFor="sg-city">City</label>
          <input id="sg-city" type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
          <label className="sr-only" htmlFor="sg-postal">Postal</label>
          <input id="sg-postal" type="text" placeholder="Postal code" value={postal} onChange={(e) => setPostal(e.target.value)} />
          <label className="sr-only" htmlFor="sg-country">Country</label>
          <input id="sg-country" type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <button className="btn btn-primary" onClick={() => runSearch()}>Search</button>
          <button className="btn btn-ghost" onClick={geoLocate}>Use my location</button>
        </div>
      </header>

      {loading && (
        <div className="center"><div className="vf-loader" aria-label="Loading"></div></div>
      )}

      {!loading && items.length === 0 && (
        <div className="card"><p className="muted">No parishes found. Try different search values.</p></div>
      )}

      {!loading && items.length > 0 && (
        <div className="grid grid-3">
          {items.map((p) => (
            <ParishCard key={p.id} parish={p} onSave={saveParish} />
          ))}
        </div>
      )}

      {coords && (
        <div className="card stack">
          <h3>Approximate location</h3>
          <p className="muted">Latitude {coords.lat.toFixed(4)}, Longitude {coords.lng.toFixed(4)}</p>
          <p className="muted">A map view can be added later.</p>
        </div>
      )}
    </section>
  );
}

function ParishCard({ parish, onSave }) {
  const line1 = [parish.address, parish.city].filter(Boolean).join(", ");
  const line2 = [parish.region, parish.postalCode, parish.country].filter(Boolean).join(", ");
  return (
    <article className="card stack">
      <h3>{parish.name || "Parish"}</h3>
      {line1 && <div className="muted">{line1}</div>}
      {line2 && <div className="muted">{line2}</div>}
      {parish.phone && <div className="muted">Phone: {parish.phone}</div>}
      {parish.email && <div className="muted">Email: {parish.email}</div>}
      {parish.website && (
        <div>
          <a href={safeUrl(parish.website)} target="_blank" rel="noreferrer">Website</a>
        </div>
      )}
      <div className="right">
        <button className="btn btn-primary" onClick={() => onSave(parish)}>Save</button>
      </div>
    </article>
  );
}

function safeUrl(u) {
  try {
    const url = new URL(u, window.location.origin);
    return url.toString();
  } catch {
    return "#";
  }
}
