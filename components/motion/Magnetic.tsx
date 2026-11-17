"use client";

import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Share of the pointer offset the element follows (0–1). Keep small for a subtle pull. */
  strength?: number;
  /** Extra distance (px) around the element where the pull starts. */
  reach?: number;
  className?: string;
};

/**
 * Magnetic hover: the element eases toward the pointer when it comes near and
 * springs back when it leaves. Only for fine pointers; off for reduced motion.
 */
export function Magnetic({ children, strength = 0.3, reach = 40, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;

    const tick = () => {
      x += (tx - x) * 0.15;
      y += (ty - y) * 0.15;
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
      raf = Math.abs(tx - x) > 0.05 || Math.abs(ty - y) > 0.05 ? requestAnimationFrame(tick) : 0;
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick);
    };

    const onMove = (e: PointerEvent) => {
      // Measure without our own offset so the target doesn't chase itself.
      const r = el.getBoundingClientRect();
      const cx = r.left - x + r.width / 2;
      const cy = r.top - y + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const inside = Math.abs(dx) < r.width / 2 + reach && Math.abs(dy) < r.height / 2 + reach;
      [tx, ty] = inside ? [dx * strength, dy * strength] : [0, 0];
      kick();
    };
    const reset = () => {
      tx = ty = 0;
      kick();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
      el.style.transform = "";
    };
  }, [strength, reach]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
