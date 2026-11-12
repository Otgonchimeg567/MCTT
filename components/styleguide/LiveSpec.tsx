"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

const round = (px: string) => {
  const n = parseFloat(px);
  return Number.isFinite(n) ? `${Math.round(n * 100) / 100}px` : px;
};

/**
 * Renders a sample and prints its *computed* font settings underneath
 * (e.g. "Montserrat 800 · 48px/72px · -0.96px"), measured in the browser.
 */
export function LiveSpec({ label, children }: { label: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [spec, setSpec] = useState("");

  useEffect(() => {
    const el = ref.current?.firstElementChild as HTMLElement | null;
    if (!el) return;
    const measure = () => {
      const s = getComputedStyle(el);
      const family = s.fontFamily.split(",")[0].replace(/["']/g, "").replace(/^__|_[0-9a-f]+$/gi, "").replace(/_/g, " ").trim();
      const tracking = s.letterSpacing === "normal" ? "0" : round(s.letterSpacing);
      setSpec(`${family} ${s.fontWeight} · ${round(s.fontSize)}/${round(s.lineHeight)} · ${tracking}`);
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <div className="border-b border-line-soft pb-6 last:border-b-0">
      <div ref={ref}>{children}</div>
      <p className="pt-2 font-mono text-[11px] text-muted">
        <span className="text-brand">{label}</span> — {spec || "…"}
      </p>
    </div>
  );
}
