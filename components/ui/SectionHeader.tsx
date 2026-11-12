import type { ReactNode } from "react";
import { SectionTag } from "./SectionTag";
import { Heading } from "./Heading";

type Props = {
  tag: string;
  tagTone?: "purple" | "green" | "glass";
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
};

export function SectionHeader({ tag, tagTone = "purple", title, description, tone = "light" }: Props) {
  const dark = tone === "dark";
  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
      <div className="flex flex-col">
        <SectionTag tone={tagTone}>{tag}</SectionTag>
        <Heading level="h2" tone={tone} className="pt-3.5">
          {title}
        </Heading>
      </div>
      {description && (
        <p className={`text-[17px] leading-[25.5px] lg:w-[420px] lg:shrink-0 ${dark ? "text-lavender" : "text-muted"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
