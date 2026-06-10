"use client";

import { useState, useEffect } from "react";

type Prefs = { analytics: boolean; marketing: boolean; preferences: boolean };

const ALL_ON: Prefs = { analytics: true, marketing: true, preferences: true };
const ALL_OFF: Prefs = { analytics: false, marketing: false, preferences: false };

function Toggle({
  title,
  desc,
  checked,
  onChange,
  locked,
}: {
  title: string;
  desc: string;
  checked: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <li className="ckm__row">
      <div>
        <p className="ckm__row-title">{title}</p>
        <p className="ckm__row-desc">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        disabled={locked}
        onClick={() => onChange?.(!checked)}
        className={`ckt${checked ? " ckt--on" : ""}${locked ? " ckt--locked" : ""}`}
      >
        <span className="ckt__knob" />
      </button>
    </li>
  );
}

export default function CookiesBanner() {
  const [show, setShow] = useState(false);
  const [visible, setVisible] = useState(false);
  const [prefsOpen, setPrefsOpen] = useState(false);
  const [prefs, setPrefs] = useState<Prefs>(ALL_OFF);

  useEffect(() => {
    if (!localStorage.getItem("cookieConsent")) {
      setShow(true);
      setTimeout(() => setVisible(true), 200);
    }
  }, []);

  const persist = (p: Prefs) => {
    localStorage.setItem(
      "cookieConsent",
      JSON.stringify({ necessary: true, ...p })
    );
    setPrefsOpen(false);
    setVisible(false);
    setTimeout(() => setShow(false), 400);
  };

  if (!show) return null;

  return (
    <>
      <div
        className={`ck${visible ? " ck--in" : ""}`}
        role="dialog"
        aria-label="Cookie consent"
      >
        <div className="ck__head">
          <span className="ck__dot" aria-hidden="true" />
          <p className="ck__title">Cookies</p>
        </div>
        <p className="ck__text">
          We use minimal cookies to improve your experience and measure
          performance. No advertising, no cross-site tracking.
        </p>
        <div className="ck__actions">
          <button
            onClick={() => persist(ALL_OFF)}
            className="ck__btn ck__btn--ghost"
          >
            Reject
          </button>
          <button
            onClick={() => persist(ALL_ON)}
            className="ck__btn ck__btn--primary"
          >
            Accept all
          </button>
        </div>
        <button onClick={() => setPrefsOpen(true)} className="ck__link">
          Customize preferences
        </button>
      </div>

      {prefsOpen && (
        <div
          className="ckm"
          role="dialog"
          aria-modal="true"
          aria-label="Cookie preferences"
        >
          <button
            className="ckm__backdrop"
            aria-label="Close preferences"
            onClick={() => setPrefsOpen(false)}
          />
          <div className="ckm__panel">
            <div className="ckm__top">
              <p className="ckm__title">Cookie Preferences</p>
              <button
                className="ckm__close"
                aria-label="Close"
                onClick={() => setPrefsOpen(false)}
              >
                ✕
              </button>
            </div>
            <p className="ckm__intro">
              Choose which categories you allow. Strictly necessary cookies keep
              the site working and are always on.
            </p>
            <ul className="ckm__list">
              <Toggle
                title="Strictly necessary"
                desc="Required for core site functionality. Always active."
                checked
                locked
              />
              <Toggle
                title="Analytics"
                desc="Anonymous usage metrics so we can improve the site."
                checked={prefs.analytics}
                onChange={(v) => setPrefs((p) => ({ ...p, analytics: v }))}
              />
              <Toggle
                title="Marketing"
                desc="Helps us measure how campaigns perform."
                checked={prefs.marketing}
                onChange={(v) => setPrefs((p) => ({ ...p, marketing: v }))}
              />
              <Toggle
                title="Preferences"
                desc="Remembers your choices and settings."
                checked={prefs.preferences}
                onChange={(v) => setPrefs((p) => ({ ...p, preferences: v }))}
              />
            </ul>
            <div className="ckm__actions">
              <button
                onClick={() => persist(ALL_OFF)}
                className="ck__btn ck__btn--ghost"
              >
                Reject all
              </button>
              <button
                onClick={() => persist(prefs)}
                className="ck__btn ck__btn--ghost"
              >
                Save choices
              </button>
              <button
                onClick={() => persist(ALL_ON)}
                className="ck__btn ck__btn--primary"
              >
                Accept all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
