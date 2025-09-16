"use client";

import { useState, useEffect } from "react";

export default function CookiesBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem("cookieConsent");
    if (!cookieConsent) {
      setShowBanner(true);
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setShowBanner(false);
    setIsVisible(false);
  };

  const rejectCookies = () => {
    localStorage.setItem("cookieConsent", "rejected");
    setShowBanner(false);
    setIsVisible(false);
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Page blur overlay */}
      <div
        className={`cookies-overlay ${
          isVisible ? "cookies-overlay--visible" : ""
        }`}
      />

      {/* Cookies banner */}
      <div
        className={`cookies-banner ${
          isVisible ? "cookies-banner--visible" : ""
        }`}
      >
        <div className="cookies-banner__content">
          <div className="cookies-banner__text">
            <h3 className="cookies-banner__title">We use cookies</h3>
            <p className="cookies-banner__description">
              We use minimal cookies to improve your experience and analyze our
              website performance. We don't use advertising cookies or track you
              across other sites.
            </p>
          </div>
          <div className="cookies-banner__actions">
            <button
              onClick={rejectCookies}
              className="cookies-banner__button cookies-banner__button--secondary"
            >
              Reject
            </button>
            <button
              onClick={acceptCookies}
              className="cookies-banner__button cookies-banner__button--primary"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
