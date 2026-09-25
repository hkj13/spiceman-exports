export function ChapterLabel({ n, label, dark = false }: { n?: string; label: string; dark?: boolean }) {
  return (
    <p className={`mono-label flex items-center gap-3 ${dark ? "text-turmeric" : "text-brown"}`}>
      <span className={`inline-block h-px w-8 ${dark ? "bg-turmeric" : "bg-brown"}`} aria-hidden />
      {n ? `${n} · ${label}` : label}
    </p>
  );
}
