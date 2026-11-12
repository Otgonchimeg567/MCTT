import { SectionTag } from "@/components/ui/SectionTag";

export function BigStatCard({ tag, value, description }: { tag: string; value: string; description: string }) {
  return (
    <div className="flex min-h-[360px] flex-col justify-between gap-10 rounded-[28px] bg-night-gradient p-8 sm:p-10 lg:h-[440px]">
      <SectionTag tone="glass">{tag}</SectionTag>
      <div>
        <p className="font-display text-[72px] leading-[1.1] font-extrabold text-white sm:text-[88px] sm:leading-[96.8px]">
          {value}
        </p>
        <p className="max-w-[420px] text-[17px] leading-[25.5px] text-lavender">{description}</p>
      </div>
    </div>
  );
}
