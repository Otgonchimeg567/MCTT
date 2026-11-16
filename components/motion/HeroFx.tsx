"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive layer for the hero, mounted inside it:
 * - a canvas "crystal lattice" (fluorite is cubic) whose points bend away from the pointer and light up lime,
 *   with a shock-wave ripple on every click/tap;
 * - CSS variables on the parent section for the rest of the hero to react to:
 *   --mx/--my  pointer position in px (spotlight on the CaF₂ watermark),
 *   --tx/--ty  pointer position −0.5…0.5 (crystal tilt / parallax);
 * - clicking the crystal ([data-crystal]) spins it once.
 * Reduced motion: one static frame, no listeners.
 */
export function HeroFx() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !host || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const GAP = 34;
    const RADIUS = 170;

    let w = 0;
    let h = 0;
    let cols = 0;
    let rows = 0;
    let base: Float32Array = new Float32Array(0); // x,y per point
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const ripples: { x: number; y: number; t0: number }[] = [];
    let raf = 0;
    let visible = true;

    const resize = () => {
      const r = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / GAP) + 2;
      rows = Math.ceil(h / (GAP * 0.866)) + 2;
      base = new Float32Array(cols * rows * 2);
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = (j * cols + i) * 2;
          base[k] = (i - 1) * GAP + (j % 2 ? GAP / 2 : 0);
          base[k + 1] = (j - 1) * GAP * 0.866;
        }
      }
      if (reduced) draw(0);
    };

    let px = new Float32Array(0); // displaced x,y per point
    let glow = new Float32Array(0); // 0…1 highlight per point

    const draw = (t: number) => {
      const n = cols * rows;
      if (px.length !== n * 2) {
        px = new Float32Array(n * 2);
        glow = new Float32Array(n);
      }
      // ease the pointer so the field flows rather than snaps
      pointer.x += (pointer.tx - pointer.x) * 0.18;
      pointer.y += (pointer.ty - pointer.y) * 0.18;
      const time = t / 1000;
      const now = performance.now();

      for (let k = 0; k < n; k++) {
        let x = base[k * 2];
        let y = base[k * 2 + 1];
        if (!reduced) y += Math.sin(time * 0.7 + x * 0.012 + y * 0.008) * 2.2;
        let g = 0;

        if (pointer.active) {
          const dx = x - pointer.x;
          const dy = y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < RADIUS && d > 0.01) {
            const f = 1 - d / RADIUS;
            const push = f * f * 28;
            x += (dx / d) * push;
            y += (dy / d) * push;
            g = Math.max(g, f);
          }
        }
        for (const rp of ripples) {
          const age = (now - rp.t0) / 1000;
          const ring = age * 700;
          const dx = base[k * 2] - rp.x;
          const dy = base[k * 2 + 1] - rp.y;
          const d = Math.hypot(dx, dy);
          const band = 1 - Math.abs(d - ring) / 60;
          if (band > 0 && d > 0.01) {
            const fade = Math.max(0, 1 - age / 1.6);
            x += (dx / d) * band * 14 * fade;
            y += (dy / d) * band * 14 * fade;
            g = Math.max(g, band * fade);
          }
        }
        px[k * 2] = x;
        px[k * 2 + 1] = y;
        glow[k] = g;
      }
      for (let i = ripples.length - 1; i >= 0; i--) if (now - ripples[i].t0 > 1600) ripples.splice(i, 1);

      ctx.clearRect(0, 0, w, h);

      // lattice bonds between lit neighbours
      ctx.lineWidth = 1;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const k = j * cols + i;
          const g = glow[k];
          if (g < 0.2) continue;
          // triangular lattice: right neighbour + the two below (odd rows are shifted half a gap right)
          const down = j + 1 < rows;
          const nb = [
            i + 1 < cols ? k + 1 : -1,
            down && (j % 2 === 0 || i + 1 < cols) ? k + cols + (j % 2 ? 1 : 0) : -1,
            down && (j % 2 === 1 || i > 0) ? k + cols - (j % 2 ? 0 : 1) : -1,
          ];
          for (const m of nb) {
            if (m < 0 || m >= cols * rows) continue;
            const a = Math.min(g, glow[m]);
            if (a < 0.15) continue;
            ctx.strokeStyle = `rgba(46,155,217,${(a * 0.45).toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(px[k * 2], px[k * 2 + 1]);
            ctx.lineTo(px[m * 2], px[m * 2 + 1]);
            ctx.stroke();
          }
        }
      }
      // points
      for (let k = 0; k < n; k++) {
        const g = glow[k];
        ctx.fillStyle = g > 0.02 ? `rgba(${Math.round(255 - g * 209)},${Math.round(255 - g * 100)},${Math.round(255 - g * 38)},${(0.14 + g * 0.8).toFixed(3)})` : "rgba(255,255,255,0.12)";
        ctx.beginPath();
        ctx.arc(px[k * 2], px[k * 2 + 1], 1 + g * 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      if (visible && !document.hidden) draw(t);
      raf = requestAnimationFrame(loop);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    if (reduced) return () => ro.disconnect();

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      pointer.tx = x;
      pointer.ty = y;
      if (!pointer.active) {
        pointer.x = x;
        pointer.y = y;
        pointer.active = true;
      }
      host.style.setProperty("--mx", `${x.toFixed(0)}px`);
      host.style.setProperty("--my", `${y.toFixed(0)}px`);
      host.style.setProperty("--tx", (x / r.width - 0.5).toFixed(3));
      host.style.setProperty("--ty", (y / r.height - 0.5).toFixed(3));
    };
    const onLeave = () => {
      pointer.active = false;
      for (const v of ["--mx", "--my", "--tx", "--ty"]) host.style.removeProperty(v);
    };
    const onDown = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      ripples.push({ x: e.clientX - r.left, y: e.clientY - r.top, t0: performance.now() });
      const crystal = (e.target as Element).closest?.("[data-crystal]");
      if (crystal) {
        crystal.classList.remove("crystal-spin");
        void (crystal as HTMLElement).offsetWidth; // restart the animation
        crystal.classList.add("crystal-spin");
      }
    };

    host.addEventListener("pointermove", onMove);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("pointerdown", onDown);
    const io = new IntersectionObserver(([entry]) => (visible = entry.isIntersecting));
    io.observe(host);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("pointerdown", onDown);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />;
}
