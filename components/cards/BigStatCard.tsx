import Image from "next/image";
import { SectionTag } from "@/components/ui/SectionTag";

type Goal = { label: string; current: number; target: number; unit: string };

type Props = {
  tag: string;
  value: string;
  /** Small unit set after the number (e.g. "мод"). */
  unit?: string;
  description: string;
  /** Background photo; without it the card uses the night gradient + dot pattern. */
  image?: string;
  imageAlt?: string;
  /** Optional progress toward a target, shown as a thin bar under the description. */
  goal?: Goal;
};

/**
 * Hierarchy: the number leads (largest, white), the description follows (lighter), the goal bar is last (smallest).
 * With a photo, a dark green scrim (stronger at the bottom) keeps the white text readable and ties the card
 * to the section's green tag and tile icons.
 */
export function BigStatCard({ tag, value, unit, description, image, imageAlt = "", goal }: Props) {
  const percent = goal ? Math.min(100, Math.round((goal.current / goal.target) * 100)) : 0;
  return (
    <div
      className={`group/stat relative isolate flex min-h-[360px] flex-col justify-between gap-10 overflow-hidden rounded-[28px] p-8 sm:p-10 lg:h-[440px] ${
        image ? "bg-[#0e2a1b]" : "bg-night-gradient"
      }`}
    >
      {image ? (
        <>
          <Image
            src={image}
            alt={imageAlt}
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="-z-20 object-cover transition-transform duration-[1500ms] ease-out group-hover/stat:scale-105"
          />
          <span
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0e2a1b]/95 via-[#0e2a1b]/55 to-[#0e2a1b]/25"
          />
        </>
      ) : (
        <span
          aria-hidden
          className="absolute inset-0 -z-10 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:20px_20px]"
        />
      )}

      {/* On the photo the tag takes the section's green (Similarity with the "БАЙГАЛЬ ОРЧИН" tag); glass was unreadable over leaves. */}
      <SectionTag tone={image ? "green" : "glass"}>{tag}</SectionTag>
      <div>
        <p className="font-display font-extrabold text-white">
          <span className="text-[72px] leading-[1.1] sm:text-[88px] sm:leading-[96.8px]">{value}</span>
          {unit && <span className="pl-2 text-2xl text-white/80 sm:text-3xl">{unit}</span>}
        </p>
        <p className="max-w-[420px] text-[17px] leading-[25.5px] text-white/85">{description}</p>

        {goal && (
          <div className="max-w-[420px] pt-6">
            <div className="flex items-baseline justify-between text-[13px] leading-[19.5px]">
              <span className="font-semibold tracking-[0.04em] text-white/85">{goal.label}</span>
              <span className="text-white/75">
                <span className="font-bold text-white">{goal.current.toLocaleString("en-US")}</span> /{" "}
                {goal.target.toLocaleString("en-US")} {goal.unit}
              </span>
            </div>
            <div
              className="mt-2 h-2 rounded-full bg-white/20"
              role="progressbar"
              aria-valuenow={goal.current}
              aria-valuemin={0}
              aria-valuemax={goal.target}
              aria-label={`${goal.label}: ${goal.current} / ${goal.target} ${goal.unit}`}
            >
              <div className="h-full rounded-full bg-mint" style={{ width: `${percent}%` }} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
