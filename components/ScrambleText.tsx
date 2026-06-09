"use client";

import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&/<>=";
const randomGlyph = () => GLYPHS[(Math.random() * GLYPHS.length) | 0];

/**
 * Decode-on-reveal text. The real string is server-rendered (crawler- and
 * no-JS-safe, and the accessible name via aria-label), then on mount the
 * characters resolve left-to-right out of a churn of random glyphs — the
 * "terminal decoding" look. One-shot; skipped entirely under reduced motion.
 */
export default function ScrambleText({
  text,
  delay = 0,
  duration = 720,
  className,
}: {
  text: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const chars = text.split("");
    // each non-space char locks in across the first ~70% of the duration,
    // with a little jitter so the resolve isn't a clean wipe
    const revealAt = chars.map((c, i) =>
      c === " "
        ? 0
        : (i / chars.length) * duration * 0.7 + Math.random() * duration * 0.28
    );
    const buf = chars.map(randomGlyph);

    let raf = 0;
    let timer = 0;
    let start = 0;
    let lastChurn = 0;

    el.classList.add("is-decoding");

    const frame = (now: number) => {
      if (!start) start = now;
      const t = now - start;
      const churn = now - lastChurn > 45;
      if (churn) lastChurn = now;

      let done = true;
      let out = "";
      for (let i = 0; i < chars.length; i++) {
        const c = chars[i];
        if (c === " ") {
          out += " ";
        } else if (t >= revealAt[i]) {
          out += c;
        } else {
          done = false;
          if (churn) buf[i] = randomGlyph();
          out += buf[i];
        }
      }
      el.textContent = out;
      if (done) {
        el.classList.remove("is-decoding");
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    timer = window.setTimeout(() => {
      raf = requestAnimationFrame(frame);
    }, delay);

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      el.textContent = text;
      el.classList.remove("is-decoding");
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      {text}
    </span>
  );
}
