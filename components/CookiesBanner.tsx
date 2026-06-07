"use client";

import { useState, useEffect } from "react";

export default function CookiesBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
      setTimeout(() => setIsVisible(true), 200);
    }
  }, []);

  const decide = (choice: "accepted" | "rejected") => {
    localStorage.setItem("cookieConsent", choice);
    setIsVisible(false);
    setTimeout(() => setShowBanner(false), 400);
  };

  if (!showBanner) return null;

  return (
    <div
      className={`ck${isVisible ? " ck--in" : ""}`}
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
          onClick={() => decide("rejected")}
          className="ck__btn ck__btn--ghost"
        >
          Reject
        </button>
        <button
          onClick={() => decide("accepted")}
          className="ck__btn ck__btn--primary"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
