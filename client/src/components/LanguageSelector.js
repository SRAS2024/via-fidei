// client/src/components/LanguageSelector.js
import React from "react";
import { LocaleContext } from "../index";

const LANGS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "pt", label: "Português" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pl", label: "Polski" }
];

export default function LanguageSelector({ inline = true }) {
  const { locale, setLocale } = React.useContext(LocaleContext);

  return (
    <div className={`lang-compact ${inline ? "" : "stack"}`}>
      <label htmlFor="vf-lang" className="sr-only">Language</label>
      <select
        id="vf-lang"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        aria-label="Language selector"
      >
        {LANGS.map((l) => (
          <option key={l.code} value={l.code}>
            {l.label}
          </option>
        ))}
      </select>
    </div>
  );
}
