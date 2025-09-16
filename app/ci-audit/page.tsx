"use client";

import { useEffect } from "react";
import Image from "next/image";
import Header from "../../components/Header";

const CALENDAR_URL = "https://calendar.app.google/UUfpdoQ92LEyTUCg6";

export default function CIAuditPage() {
  useEffect(() => {
    // Redirect after a short delay to show the branded page
    const timer = setTimeout(() => {
      window.location.href = CALENDAR_URL;
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="main-container">
      <Header />

      <section
        className="hero-section"
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="hero-content"
          style={{ textAlign: "center", maxWidth: "600px" }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <Image
              src="/brand/unflakeops_icon_dots_dark_400.png"
              alt="UnflakeOps"
              width={80}
              height={80}
              priority
              style={{ margin: "0 auto" }}
            />
          </div>

          <h1
            className="hero-title"
            style={{ fontSize: "2.5rem", marginBottom: "1rem" }}
          >
            Redirecting to CI Audit Booking
          </h1>

          <p
            className="hero-subtitle"
            style={{ fontSize: "1.2rem", marginBottom: "2rem" }}
          >
            You're being redirected to book your 15-minute CI audit session.
          </p>

          <div
            style={{
              background: "rgba(2,6,23,.4)",
              border: "1px solid #1f2937",
              borderRadius: "12px",
              padding: "1.5rem",
              marginBottom: "2rem",
            }}
          >
            <p style={{ margin: "0 0 1rem 0", color: "#cbd5e1" }}>
              <strong>What you'll get:</strong>
            </p>
            <ul
              style={{
                textAlign: "left",
                margin: "0",
                paddingLeft: "1.5rem",
                color: "#cbd5e1",
                lineHeight: "1.6",
              }}
            >
              <li>Baseline assessment of your current flake rate</li>
              <li>Top 3 fastest wins identified</li>
              <li>Custom recommendations for your CI setup</li>
              <li>No obligation - just valuable insights</li>
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              color: "#94a3b8",
              fontSize: "0.9rem",
            }}
          >
            <div
              style={{
                width: "12px",
                height: "12px",
                border: "2px solid #38bdf8",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            />
            Redirecting in a moment...
          </div>

          <div style={{ marginTop: "1.5rem" }}>
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noreferrer"
              className="hero-cta"
              style={{
                display: "inline-block",
                textDecoration: "none",
              }}
            >
              Open booking page directly
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}
