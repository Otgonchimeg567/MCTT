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
};

export function FeatureCard({ preview, previewTone = "light", title, description, action }: Props) {
  return (
    <article className="flex flex-col rounded-[28px] border border-line bg-white px-4 pt-4 pb-[26px]">
      <div
        className={`flex min-h-[280px] flex-col lg:h-[280px] overflow-clip rounded-[20px] p-[22px] ${
          previewTone === "dark" ? "bg-night-gradient" : "bg-sand"
        }`}
      >
        {preview}
      </div>
      <Heading level="h3" className="px-2.5 pt-[22px]">
        {title}
      </Heading>
      <p className="px-2.5 pt-2 pb-4 text-[15px] leading-[22.5px] text-muted">{description}</p>
      <div className="mt-auto px-2.5">
        <Button
          href={action.href}
          variant="outline"
          size="sm"
          {...(action.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {action.label}
        </Button>
      </div>
    </article>
  );
}
