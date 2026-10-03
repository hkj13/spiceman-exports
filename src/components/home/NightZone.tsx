import type { ReactNode } from "react";

/** A green section without a particle scene; starts (or joins) a green run. */
export function NightZone({
  children,
  className = "",
  labelledBy,
  rail,
  toneStart,
}: {
  children: ReactNode;
  className?: string;
  labelledBy?: string;
  rail?: string;
  toneStart?: boolean;
}) {
  return (
    <section
      className={`tone-scrub ${className}`}
      aria-labelledby={labelledBy}
      data-rail={rail}
      data-tone-start={toneStart ? "" : undefined}
    >
      {children}
    </section>
  );
}
