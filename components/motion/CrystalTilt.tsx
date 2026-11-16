"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";

/**
 * Crystal that leans toward the pointer (3D tilt) while its glow drifts the other way, so the light seems to
 * move across it. Mouse/pen only, and off under reduced motion; it eases back to rest on leave.
 */
export function CrystalTilt({ alt }: { alt: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || e.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 16).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 20).toFixed(2)}deg`);
    el.style.setProperty("--gx", `${(-x * 40).toFixed(1)}px`);
    el.style.setProperty("--gy", `${(-y * 40).toFixed(1)}px`);
  };

  const reset = () => {
    const el = ref.current;
    if (!el) return;
    for (const v of ["--rx", "--ry", "--gx", "--gy"]) el.style.removeProperty(v);
  };

  return (
    <div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={reset}
      className="group/crystal relative flex h-full w-full items-center justify-center [perspective:900px]"
    >
      <div
        aria-hidden
        className="absolute size-[260px] translate-x-(--gx,0px) translate-y-(--gy,0px) rounded-full bg-[#2e9bd9]/30 blur-3xl transition-[translate,background-color] duration-500 ease-out group-hover/crystal:bg-[#2e9bd9]/40 sm:size-[340px]"
      />
      <div aria-hidden className="absolute bottom-[8%] h-6 w-40 rounded-[50%] bg-black/60 blur-xl sm:w-52" />
      <div className="animate-[contact-float_6s_ease-in-out_infinite]">
        <div className="rotate-x-(--rx,0deg) rotate-y-(--ry,0deg) transition-transform duration-500 ease-out [transform-style:preserve-3d]">
          <Image
            src="/images/crystal.svg"
            alt={alt}
            width={300}
            height={360}
            className="h-auto w-[180px] -rotate-[14deg] drop-shadow-[0_30px_40px_rgba(46,155,217,0.35)] transition-[filter] duration-500 group-hover/crystal:drop-shadow-[0_34px_50px_rgba(46,155,217,0.55)] sm:w-[230px] lg:w-[260px]"
          />
        </div>
      </div>
    </div>
  );
}
