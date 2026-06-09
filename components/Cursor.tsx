"use client";

import { useEffect, useRef } from "react";

/**
 * Additive custom cursor: a small dot that tracks precisely plus a ring that
 * trails with easing and swells over interactive elements. Also drives the
 * magnetic pull on [data-magnetic] targets. Desktop + fine-pointer only;
 * disabled for touch and reduced-motion (native cursor stays).
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;

    const magnets = Array.from(
      document.querySelectorAll<HTMLElement>("[data-magnetic]")
    );

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px)`;

      for (const el of magnets) {
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const radius = Math.max(r.width, r.height) * 0.75 + 36;
        // optional per-element pull strength: data-magnetic="0.22"
        const pull = parseFloat(el.dataset.magnetic || "") || 0.28;
        if (Math.hypot(dx, dy) < radius) {
          el.style.transform = `translate(${dx * pull}px, ${dy * pull}px)`;
        } else if (el.style.transform) {
          el.style.transform = "";
        }
      }
    };

    const interactive = "a, button, [data-magnetic], input, textarea, label";
    const onOver = (e: PointerEvent) => {
      const t = (e.target as HTMLElement)?.closest?.(interactive);
      ring.classList.toggle("cursor-ring--active", !!t);
    };

    const loop = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      document.documentElement.classList.remove("has-cursor");
      magnets.forEach((el) => (el.style.transform = ""));
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
    </>
  );
}
