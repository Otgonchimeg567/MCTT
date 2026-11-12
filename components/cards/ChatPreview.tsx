import { company, faq } from "@/lib/content";
import Image from "next/image";

/** Static illustration of the Q&A chat — not a functional chat widget. */
export function ChatPreview() {
  return (
    <div className="flex flex-col rounded-[28px] border border-line bg-white p-5 sm:p-7 lg:h-[418px]">
      <div className="flex items-center gap-2.5 border-b border-line-soft pb-4">
        <Image src="/images/logo.png" alt="" width={34} height={25} className="object-cover" />
        <p className="text-base leading-6 font-bold text-ink">
          {company.name} {company.suffix}
        </p>
      </div>

      <ul className="flex flex-col pt-[18px]">
        {faq.messages.map((m, i) => (
          <li key={m.text} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"} ${i > 0 ? "pt-3" : ""}`}>
            <span
              className={`max-w-full rounded-[18px] px-[18px] py-3 text-[15px] leading-[22.5px] ${
                m.from === "user" ? "bg-brand-gradient text-white" : "bg-sand text-ink"
              }`}
            >
              {m.text}
            </span>
          </li>
        ))}
      </ul>

      <div
        aria-hidden
        className="mt-5 flex items-center justify-between rounded-full border border-line py-2 pr-2 pl-5"
      >
        <span className="text-[15px] leading-[22.5px] text-faint">{faq.placeholder}</span>
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-gradient-diagonal text-[15px] font-extrabold text-white">
          →
        </span>
      </div>
    </div>
  );
}
