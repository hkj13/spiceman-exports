import type { ReactNode } from "react";

/**
 * A paper sample tag on a string: the way specs travel with a bag. Used for
 * spec lists on Home, Process and product pages.
 */
export function SampleTag({
  title,
  children,
  className = "",
  swing = true,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  swing?: boolean;
}) {
  return (
    <div className={`relative ${className}`}>
      {/* string */}
      <svg aria-hidden viewBox="0 0 40 60" className="absolute -top-12 left-9 h-14 w-10 text-brown/60" fill="none">
        <path d="M20 0c-6 18 10 30 0 58" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <div
        className={`keep-tone relative origin-[2.75rem_0] rounded-[3px] bg-[#f6ecd6] px-6 pb-6 pt-10 text-ink shadow-[0_1px_0_rgb(90_46_26/0.08),0_18px_40px_-24px_rgb(90_46_26/0.45)] [clip-path:polygon(0_14px,14px_0,100%_0,100%_100%,0_100%)] ${swing ? "motion-safe:animate-[tag-swing_6s_ease-in-out_infinite]" : ""}`}
      >
        <span aria-hidden className="absolute left-9 top-4 block h-3 w-3 rounded-full border border-brown/50 bg-paper" />
        <p className="mono-label mb-4 pr-16 text-brown">{title}</p>
        {children}
      </div>
    </div>
  );
}
