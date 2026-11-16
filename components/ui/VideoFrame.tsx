"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** mp4 (H.264), muted footage — no sound track needed. */
  src?: string;
  /** Still shown while loading, under reduced motion, and as the image when there is no video. */
  poster?: string;
  /** Describes what the footage shows, for screen readers. */
  label: string;
  className?: string;
};

/**
 * 16:9 media block: silent looping video, or just the poster image when no video is given.
 *
 * Plays only while on screen (saves battery/CPU) and never under prefers-reduced-motion — then the
 * poster stays as a still. muted + playsInline are both required for autoplay on phones.
 */
export function VideoFrame({ src, poster, label, className = "" }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(video);
    return () => io.disconnect();
  }, [src]);

  // 16:9 on phones/tablets, 21:9 on wide screens so a full-width block doesn't fill the whole viewport.
  const frame = `block aspect-video w-full lg:aspect-[21/9] rounded-[28px] border border-line bg-sand object-cover ${className}`;

  if (!src) {
    return poster ? <img src={poster} alt={label} loading="lazy" className={frame} /> : null;
  }

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="metadata"
      poster={poster}
      aria-label={label}
      disablePictureInPicture
      controlsList="nodownload nofullscreen noremoteplayback"
      className={frame}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
}
