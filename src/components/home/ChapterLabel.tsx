export function ChapterLabel({ n, label, dark = false }: { n?: string; label: string; dark?: boolean }) {
  return (
    <p className={`mono-label flex items-center gap-3 ${dark ? "text-turmeric" : "text-brown"}`}>
      <span className={`inline-block h-px w-8 ${dark ? "bg-turmeric" : "bg-brown"}`} aria-hidden />
      {n ? `${n} · ${label}` : label}
    </p>
  );
}

/** The big step numeral every journey chapter carries, so all eight read as equal steps. */
export function StepNumber({ n, dark = false, className = "" }: { n: string; dark?: boolean; className?: string }) {
  return (
    <p
      aria-hidden
      data-n={n}
      className={`display-xxl before:content-[attr(data-n)] ${dark ? "text-paper/20" : "text-rule"} ${className}`}
    />
  );
}
