import type { ReactNode } from "react";
import { Heading } from "@/components/ui/Heading";

export type EnvIcon = "recycle" | "lab" | "storage" | "safety";

/**
 * One line-icon set (24px grid, 1.75 stroke, round caps — Lucide shapes, ISC licence) instead of mixed
 * text glyphs (♻ ⚗ ▦ ✓), which rendered at different sizes and weights per device. Similarity: four tiles,
 * four icons of the same family.
 */
const icons: Record<EnvIcon, ReactNode> = {
  recycle: (
    <>
      <path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5" />
      <path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12" />
      <path d="m14 16-3 3 3 3" />
      <path d="M8.293 13.596 7.196 9.5 3.1 10.598" />
      <path d="m9.344 5.811 1.093-1.892A1.83 1.83 0 0 1 11.985 3a1.784 1.784 0 0 1 1.546.888l3.943 6.843" />
      <path d="m13.378 9.633 4.096 1.098 1.097-4.096" />
    </>
  ),
  lab: (
    <>
      <path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" />
      <path d="M8.5 2h7" />
      <path d="M7 16h10" />
    </>
  ),
  storage: (
    <>
      <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z" />
      <path d="M6 18h12" />
      <path d="M6 14h12" />
      <rect width="12" height="12" x="6" y="10" />
    </>
  ),
  safety: (
    <>
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
};

/**
 * Same layout as BigStatCard beside it (Similarity): marker at the top, content anchored to the bottom —
 * so the tile no longer has text bunched at the top over an empty lower half (Proximity: title + description
 * stay together as one unit, the icon sits apart as the tile's label).
 */
export function EnvTile({ icon, title, description }: { icon: EnvIcon; title: string; description: string }) {
  return (
    <div className="group/tile flex flex-col justify-between gap-6 rounded-[22px] border border-line bg-white p-[22px] transition duration-300 ease-out hover:-translate-y-1 hover:border-leaf/30 hover:shadow-[0_16px_32px_-16px_rgba(40,122,76,0.35)] sm:min-h-[212px]">
      <span
        aria-hidden
        className="flex size-11 items-center justify-center rounded-[14px] bg-mint text-leaf transition duration-300 group-hover/tile:scale-110 group-hover/tile:-rotate-6 group-hover/tile:bg-leaf group-hover/tile:text-white"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-[22px]"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icons[icon]}
        </svg>
      </span>
      <div>
        <Heading level="h4">{title}</Heading>
        <p className="pt-1.5 text-sm leading-[21px] text-muted">{description}</p>
      </div>
    </div>
  );
}
