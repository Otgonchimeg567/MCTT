"use client";

import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/types";
import { QuoteRequestForm } from "./QuoteRequestForm";

export const REQUEST_HASH = "#request";

/**
 * Opens whenever the URL hash becomes #request, so any plain link
 * (<a href="#request">) on the page can open it — no shared client state needed.
 */
export function QuoteRequestDialog({ products }: { products: Product[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;

    const sync = () => {
      if (window.location.hash === REQUEST_HASH && !dialog.open) dialog.showModal();
    };
    const clearHash = () => {
      if (window.location.hash === REQUEST_HASH) {
        history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      setFormKey((k) => k + 1); // fresh form next time
    };

    sync();
    window.addEventListener("hashchange", sync);
    dialog.addEventListener("close", clearHash);
    return () => {
      window.removeEventListener("hashchange", sync);
      dialog.removeEventListener("close", clearHash);
    };
  }, []);

  const close = () => ref.current?.close();

  return (
    <dialog
      ref={ref}
      aria-labelledby="request-title"
      onClick={(e) => e.target === e.currentTarget && close()}
      className="m-auto w-[calc(100%-32px)] max-w-[560px] rounded-[28px] border border-line bg-cream p-0 text-ink backdrop:bg-navy/60 backdrop:backdrop-blur-sm"
    >
      <div className="max-h-[calc(100dvh-48px)] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 pb-5">
          <div>
            <h2 id="request-title" className="font-display text-2xl font-extrabold text-ink">
              Хүсэлт илгээх
            </h2>
            <p className="pt-1 text-[15px] text-muted">Мэдээллээ үлдээвэл бид тантай холбогдоно.</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Хаах"
            className="flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-white text-muted hover:text-ink"
          >
            ✕
          </button>
        </div>
        <QuoteRequestForm key={formKey} products={products} onDone={close} />
      </div>
    </dialog>
  );
}
