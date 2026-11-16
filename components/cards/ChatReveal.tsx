"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * List that marks itself `data-shown` once it scrolls into view, so its items can fade in
 * one after another (items use `group-data-[shown=true]/chat:` + their own transition-delay).
 * Under reduced motion the global CSS collapses the transitions, so items appear at once.
 */
export function ChatReveal({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <ul ref={ref} data-shown={shown} className={`group/chat ${className}`}>
      {children}
    </ul>
  );
}
