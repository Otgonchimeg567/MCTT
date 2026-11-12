"use client";

import { useEffect, useState } from "react";

function toRgb(value: string): [number, number, number] | null {
  const v = value.trim();
  const hex = v.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number];
  }
  const rgb = v.match(/rgba?\(([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i);
  return rgb ? [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])] : null;
}

function luminance([r, g, b]: [number, number, number]) {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrast(a: [number, number, number], b: [number, number, number]) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/** Reads the token's value from the live stylesheet, so this never drifts from globals.css. */
export function TokenSwatch({ name, utility, usage }: { name: string; utility: string; usage: string }) {
  const cssVar = `--color-${name}`;
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    setValue(getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim());
  }, [cssVar]);

  const rgb = value ? toRgb(value) : null;
  const ratio = rgb ? contrast(rgb, [255, 255, 255]) : null;

  return (
    <div className="flex flex-col">
      <div className="h-16 rounded-xl border border-black/5" style={{ background: `var(${cssVar})` }} />
      <code className="pt-2.5 font-mono text-[11px] font-semibold text-ink">{cssVar}</code>
      <span className="font-mono text-[11px] text-muted">
        {value || "…"}
        {ratio && ` · ${ratio.toFixed(1)}:1`}
      </span>
      <span className="pt-0.5 font-mono text-[11px] text-brand">{utility}</span>
      <span className="pt-1 text-xs text-muted">{usage}</span>
    </div>
  );
}
