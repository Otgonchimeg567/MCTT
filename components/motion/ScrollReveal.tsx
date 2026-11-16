"use client";

import { useEffect } from "react";

/**
 * Mounted once per page. Sets `data-shown` on every `[data-reveal]` / `[data-reveal-stagger]` element the first time
 * it scrolls into view; globals.css does the animation. Elements already on screen are shown before the hiding
 * class goes on, so nothing above the fold flickers. Without JS nothing is hidden.
 */
export function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal],[data-reveal-stagger]"));
    if (typeof IntersectionObserver === "undefined") return;

    const vh = window.innerHeight;
    for (const el of els) {
      if (el.getBoundingClientRect().top < vh * 0.9) el.dataset.shown = "static";
    }
    document.documentElement.classList.add("motion-ready");

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          (e.target as HTMLElement).dataset.shown = "in";
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    for (const el of els) if (!("shown" in el.dataset)) io.observe(el);
    return () => io.disconnect();
  }, []);

  return null;
}
