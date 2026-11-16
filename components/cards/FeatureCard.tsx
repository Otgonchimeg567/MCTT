import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Heading } from "@/components/ui/Heading";

type Props = {
  /** Illustrative preview rendered inside the 280px panel at the top of the card. */
  preview: ReactNode;
  previewTone?: "light" | "dark";
  title: string;
  description: string;
  action: { label: string; href: string };
  /** Small label pinned to the preview's bottom-right corner, clear of the panel (e.g. "Онцлох"). */
  badge?: string;
  /** `primary` marks the card's action as the main one in its row. */
  actionVariant?: "primary" | "outline";
  /** `action` = a card that asks the visitor to do something rather than describing a product: dashed outline on cream. */
  variant?: "default" | "action";
  /** Featured card is slightly larger with stronger emphasis (shadow, border glow). */
  featured?: boolean;
};

export function FeatureCard({
  preview,
  previewTone = "light",
  title,
  description,
  action,
  badge,
  actionVariant = "outline",
  variant = "default",
  featured = false,
}: Props) {
  return (
    <article
      className={`flex flex-col rounded-[28px] border px-4 pt-4 pb-[26px] transition duration-300 ease-out hover:-translate-y-1 ${
        featured
          ? "border-brand/40 bg-white shadow-[0_24px_48px_rgba(20,20,43,0.25),0_0_0_1px_rgba(59,45,143,0.2)] hover:shadow-[0_32px_64px_rgba(20,20,43,0.3),0_0_0_1px_rgba(59,45,143,0.3)]"
          : variant === "action"
            ? "border-dashed border-lavender-muted bg-cream hover:shadow-[0_8px_16px_rgba(20,20,43,0.08)]"
            : "border-line bg-white hover:shadow-[0_8px_16px_rgba(20,20,43,0.08)]"
      }`}
    >
      <div
        className={`relative flex min-h-[280px] flex-col lg:h-[280px] overflow-clip rounded-[20px] p-[22px] ${
          previewTone === "dark" ? "bg-night-gradient" : variant === "action" ? "bg-white" : "bg-sand"
        }`}
      >
        {badge && (
          <span className="absolute right-4 bottom-4 z-10 rounded-full bg-white px-2.5 py-1 text-xs leading-[18px] font-bold text-brand shadow-[0_4px_12px_rgba(20,20,43,0.18)]">
            {badge}
          </span>
        )}
        {preview}
      </div>
      <Heading level="h3" className="px-2.5 pt-[22px]">
        {title}
      </Heading>
      <p className="px-2.5 pt-2 pb-4 text-[15px] leading-[22.5px] text-muted">{description}</p>
      <div className="mt-auto px-2.5">
        <Button
          href={action.href}
          variant={actionVariant}
          size="sm"
          {...(action.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {action.label}
        </Button>
      </div>
    </article>
  );
}
