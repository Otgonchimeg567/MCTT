import { company, faq } from "@/lib/content";
import Image from "next/image";
import { ChatReveal } from "./ChatReveal";

/** Fades/slides an item in once the list is on screen; `step` sets its place in the sequence. */
const reveal =
  "translate-y-2 opacity-0 transition duration-500 ease-out group-data-[shown=true]/chat:translate-y-0 group-data-[shown=true]/chat:opacity-100";
const delay = (step: number) => ({ transitionDelay: `${step * 140}ms` });

/**
 * Static illustration of the Q&A chat — not a functional chat widget.
 *
 * Three levels of emphasis, each from a different attribute so none needs to be loud:
 * 1. Visitor question: the only saturated colour (gradient) + the "speaking" tail corner.
 * 2. Company answer: tinted fill (lilac), same size, tail on the other side.
 * 3. Suggestions: smaller outlined chips under a small label, grouped apart.
 */
export function ChatPreview() {
  return (
    <div className="relative">
      {/* Pattern: a faint dot grid offset behind the card (echoes the hero) gives depth without touching the content. */}
      <div
        aria-hidden
        className="absolute -right-4 -bottom-4 hidden h-2/3 w-2/3 rounded-[28px] opacity-60 [background-image:radial-gradient(circle,var(--color-lavender-muted)_1px,transparent_1.3px)] [background-size:16px_16px] sm:block"
      />

      <div className="relative flex flex-col rounded-[28px] border border-line bg-white p-5 shadow-[0_20px_50px_-24px_rgba(59,45,143,0.25)] sm:p-7">
        <div className="flex items-center gap-3 border-b border-line-soft pb-5">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-cream">
            <Image src="/images/logo.png" alt="" width={32} height={24} className="object-contain" />
          </span>
          <div className="flex flex-col">
            <p className="text-lg leading-7 font-bold text-ink">
              {company.name} {company.suffix}
            </p>
            <p className="flex items-center gap-1.5 text-sm leading-5 font-medium text-leaf">
              <span className="size-2 rounded-full bg-leaf" />
              {faq.status}
            </p>
          </div>
        </div>

        <ChatReveal className="flex flex-col pt-5">
          {/* 1 — focal point */}
          <li style={delay(0)} className={`flex justify-end ${reveal}`}>
            <span className="max-w-[85%] rounded-[18px] rounded-br-md bg-brand-gradient px-5 py-3.5 text-base leading-6 font-medium text-white shadow-[0_8px_20px_-8px_rgba(59,45,143,0.5)]">
              {faq.question}
            </span>
          </li>

          {/* 2 — answer */}
          <li style={delay(1)} className={`flex justify-start pt-4 ${reveal}`}>
            <span className="max-w-[85%] rounded-[18px] rounded-bl-md bg-lilac px-5 py-3.5 text-base leading-6 text-body">
              {faq.answer}
            </span>
          </li>

          {/* 3 — suggestions, set apart by a larger gap + label */}
          <li style={delay(2)} className={`pt-6 ${reveal}`}>
            <p className="pb-3 text-xs font-semibold tracking-[0.14em] text-faint uppercase">{faq.suggestionsLabel}</p>
            <ul className="flex flex-wrap gap-2">
              {faq.suggestions.map((s) => (
                <li
                  key={s}
                  className="rounded-full border border-line bg-white px-4 py-2.5 text-sm leading-[20px] text-muted"
                >
                  {s}
                </li>
              ))}
            </ul>
          </li>
        </ChatReveal>

        <div
          aria-hidden
          className="mt-7 flex items-center justify-between rounded-full border border-line bg-cream/60 py-3 pr-3 pl-6"
        >
          <span className="text-base leading-6 text-faint">{faq.placeholder}</span>
          <span className="flex size-11 items-center justify-center rounded-full bg-brand-gradient-diagonal text-lg font-extrabold text-white">
            →
          </span>
        </div>
      </div>
    </div>
  );
}
