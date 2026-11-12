"use client";

import { useEffect, useState } from "react";
import { sgNav } from "@/lib/styleguide";

/** Numbered side navigation that highlights the section currently in view. */
export function SgNav() {
  const [active, setActive] = useState<string>(sgNav[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -60% 0px" },
    );
    sgNav.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Desktop: sticky sidebar */}
      <nav aria-label="Styleguide-ийн бүлгүүд" className="sticky top-24 hidden self-start lg:block">
        <ol className="flex flex-col gap-0.5">
          {sgNav.map(({ id, label }, i) => (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active === id ? "true" : undefined}
                className={`flex items-baseline gap-3 rounded-lg px-2 py-1.5 text-sm transition ${
                  active === id ? "bg-white font-semibold text-brand" : "text-body hover:text-brand"
                }`}
              >
                <span className="w-4 text-[10px] text-muted tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Mobile: horizontal chip strip under the header */}
      <nav aria-label="Styleguide-ийн бүлгүүд" className="sticky top-[64px] z-10 -mx-4 overflow-x-auto border-b border-line bg-cream/95 px-4 py-2.5 backdrop-blur lg:hidden">
        <ol className="flex w-max gap-1.5">
          {sgNav.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`block rounded-full px-3 py-1.5 text-[13px] whitespace-nowrap ${
                  active === id ? "bg-brand text-white" : "bg-white text-body"
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
