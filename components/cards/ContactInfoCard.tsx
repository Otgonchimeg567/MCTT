import type { ReactNode } from "react";

type Icon = "phone" | "office" | "plant";

type Props = {
  label: string;
  value: string;
  href?: string;
  /** The main way to reach us: brighter card, larger value, whole card is the link with an action hint. */
  primary?: boolean;
  /** Action hint shown on a primary card (e.g. "Залгах"). */
  hint?: string;
  icon?: Icon;
};

const icons: Record<Icon, ReactNode> = {
  phone: (
    <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z" />
  ),
  office: <path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4h2a2 2 0 0 1 2 2v10h-7v-4h-4v4H4Zm4-14v2h2V7H8Zm4 0v2h2V7h-2Zm-4 4v2h2v-2H8Zm4 0v2h2v-2h-2Z" />,
  plant: <path d="M3 21V10l5 3V10l5 3V4h4l1 9h3v8H3Zm4-5v2h2v-2H7Zm5 0v2h2v-2h-2Z" />,
};

/** Icon in a tinted square: same position on every card, so the column scans as a list. */
function IconBadge({ icon, strong }: { icon?: Icon; strong?: boolean }) {
  if (!icon) return null;
  return (
    <span
      aria-hidden
      className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
        strong ? "bg-white text-brand" : "bg-white/10 text-lavender"
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor">
        {icons[icon]}
      </svg>
    </span>
  );
}

const external = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {});

export function ContactInfoCard({ label, value, href, primary = false, hint, icon }: Props) {
  if (primary && href) {
    return (
      <a
        href={href}
        className="group flex items-center gap-4 rounded-[20px] border border-white/25 bg-white/14 px-[22px] py-5 shadow-[0_16px_32px_-16px_rgba(10,10,40,0.6)] transition hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <IconBadge icon={icon} strong />
        <span className="min-w-0 flex-1">
          <span className="block pb-0.5 text-xs leading-[18px] tracking-[0.96px] text-lavender">{label}</span>
          <span className="block font-display text-[20px] leading-[28px] font-extrabold text-white sm:text-[24px] sm:leading-[30px]">
            {value}
          </span>
        </span>
        {/* Glass, not solid white: the section's one solid white button stays the "Хүсэлт илгээх" CTA. */}
        {hint && (
          <span className="hidden shrink-0 items-center gap-1 rounded-full border border-white/30 px-3.5 py-1.5 text-sm font-semibold text-white sm:inline-flex">
            {hint}
            <span aria-hidden className="transition group-hover:translate-x-1">
              →
            </span>
          </span>
        )}
      </a>
    );
  }

  const Tag = href ? "a" : "div";
  return (
    <Tag
      {...(href ? { href, ...external(href) } : {})}
      className={`group flex items-center gap-4 rounded-[20px] border border-white/12 bg-white/7 px-[22px] py-[18px] ${
        href ? "transition hover:border-white/25 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" : ""
      }`}
    >
      <IconBadge icon={icon} />
      <span className="min-w-0 flex-1">
        <span className="block pb-0.5 text-xs leading-[18px] tracking-[0.96px] text-lavender">{label}</span>
        <span className="block text-[16px] leading-6 font-semibold text-white/90">{value}</span>
      </span>
      {href && (
        <span aria-hidden className="shrink-0 text-sm text-lavender transition group-hover:translate-x-1 group-hover:text-white">
          ↗
        </span>
      )}
    </Tag>
  );
}
