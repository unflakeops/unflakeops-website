"use client";

import { useEffect, useRef } from "react";

/**
 * GPU shader hero field — a domain-warped fractal-noise flow rendered as a
 * GLSL fragment shader. Liquid, luminous, cursor-reactive violet→cyan light.
 * Raw WebGL, single full-screen quad. Falls back silently (the CSS gradient
 * behind it shows) if WebGL is unavailable.
 */
const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;   // normalized, bottom-left origin; (-1,-1) when inactive
uniform float uMouseOn;
uniform float uScroll; // 0..1 progress leaving the hero
uniform float uVel;    // 0..1 smoothed scroll velocity
uniform float uCalm;   // 1 = subdued bookend variant

float hash(vec2 p){
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes.xy;
  vec2 p = uv;
  p.x *= uRes.x / uRes.y;            // aspect-correct
  p.y -= uScroll * 0.30;             // parallax drift as you scroll away
  float t = uTime * (0.045 + uVel * 0.11);  // scroll speed quickens the flow

  // mouse warp — gentle pull of the flow toward the cursor
  vec2 m = uMouse; m.x *= uRes.x / uRes.y;
  float md = distance(p, m);
  float pull = uMouseOn * 0.35 * exp(-md * 3.0);

  // domain warp (flowing liquid structure)
  vec2 q = vec2(fbm(p * 1.6 + t), fbm(p * 1.6 + vec2(5.2, 1.3) - t));
  vec2 r = vec2(
    fbm(p * 1.6 + 2.0 * q + vec2(1.7, 9.2) + 0.15 * t + pull),
    fbm(p * 1.6 + 2.0 * q + vec2(8.3, 2.8) - 0.12 * t)
  );
  float f = fbm(p * (1.6 + uVel * 0.5) + 2.0 * r);  // velocity adds turbulence

  // luminous filaments (the "signal" ridges)
  float fil = smoothstep(0.52, 0.78, f);
  float glow = smoothstep(0.62, 0.95, f);

  vec3 bg     = vec3(0.090, 0.078, 0.180);  // deep violet-black
  vec3 violet = vec3(0.318, 0.260, 0.831);  // #5142d4
  vec3 cyan   = vec3(0.227, 0.788, 0.910);  // #3ac9e8

  vec3 col = mix(bg, violet, smoothstep(0.18, 0.70, f));
  col = mix(col, cyan, fil * 0.55);
  col += cyan * glow * (0.35 + uVel * 0.45) * (1.0 - uCalm * 0.4); // bloom flares with scroll speed

  // cursor halo
  col += mix(cyan, vec3(0.6, 0.55, 1.0), 0.4) * uMouseOn * 0.22 * exp(-md * 4.5);

  // keep it readable: darken left third where the headline sits
  col *= 0.62 + 0.38 * smoothstep(0.0, 0.62, uv.x);

  // vignette
  float vig = smoothstep(1.25, 0.25, length(uv - 0.5));
  col *= 0.72 + 0.28 * vig;

  col *= 1.0 - uScroll * 0.42;               // dim as the hero scrolls away
  col = mix(col, col * 0.66, uCalm);         // subdued bookend variant

  gl_FragColor = vec4(col, 1.0);
}
`;

export default function ShaderField({ calm = false }: { calm?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const canvas: HTMLCanvasElement = cv;
    const glCtx =
      (canvas.getContext("webgl", { antialias: true, alpha: true }) as
        | WebGLRenderingContext
        | null) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!glCtx) return; // fallback: CSS gradient behind shows
    const gl: WebGLRenderingContext = glCtx;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function compile(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "uRes");
    const uTime = gl.getUniformLocation(prog, "uTime");
    const uMouse = gl.getUniformLocation(prog, "uMouse");
    const uMouseOn = gl.getUniformLocation(prog, "uMouseOn");
    const uScroll = gl.getUniformLocation(prog, "uScroll");
    const uVel = gl.getUniformLocation(prog, "uVel");
    const uCalm = gl.getUniformLocation(prog, "uCalm");
    gl.uniform1f(uCalm, calm ? 1 : 0);

    let w = 0;
    let h = 0;
    const mouse = { x: -1, y: -1, on: 0 };
    let scrollTarget = 0;
    let scrollN = 0;
    let velTarget = 0;
    let velSmooth = 0;
    let lastY = window.scrollY;
    let visible = true;

    function onScroll() {
      const y = window.scrollY;
      scrollTarget = Math.min(1, y / (window.innerHeight * 1.2));
      velTarget = Math.min(1, Math.abs(y - lastY) / 60);
      lastY = y;
    }

    function resize() {
      const parent = canvas.parentElement;
      const rect = parent
        ? parent.getBoundingClientRect()
        : { width: window.innerWidth, height: 600 };
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = Math.max(320, rect.width);
      h = Math.max(360, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      // reduced motion runs no frame loop, so repaint the static frame here
      // (otherwise the resized framebuffer stretches the last draw)
      if (reduced) gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1.0 - (e.clientY - rect.top) / rect.height; // flip to gl origin
      mouse.on = 1;
    }
    function onLeave() {
      mouse.on = 0;
    }

    const start =
      typeof performance !== "undefined" ? performance.now() : 0;
    let raf = 0;
    function frame(now: number) {
      if (!visible) {
        raf = 0;
        return;
      }
      scrollN += (scrollTarget - scrollN) * 0.1;
      velTarget *= 0.9; // decay so it eases back to 0 when scrolling stops
      velSmooth += (velTarget - velSmooth) * 0.15;
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uMouseOn, mouse.on);
      gl.uniform1f(uScroll, scrollN);
      gl.uniform1f(uVel, velSmooth);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    if (!calm) window.addEventListener("scroll", onScroll, { passive: true });

    // pause rendering when the hero is off-screen
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible && !reduced && !raf) raf = requestAnimationFrame(frame);
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    if (reduced) {
      gl.uniform1f(uTime, 6.0);
      gl.uniform2f(uMouse, -1, -1);
      gl.uniform1f(uMouseOn, 0);
      gl.uniform1f(uScroll, 0);
      gl.uniform1f(uVel, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    } else {
      raf = requestAnimationFrame(frame);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("scroll", onScroll);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
        pointerEvents: "none",
      }}
    />
  );
}
