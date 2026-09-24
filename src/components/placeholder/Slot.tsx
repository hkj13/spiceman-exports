import type { ReactNode } from "react";

type Props<T> = {
  /** What belongs here, e.g. "certifications" */
  label: string;
  /** Where to add it, e.g. "site.certifications in src/config/site.ts" */
  source: string;
  items: readonly T[];
  children: (items: readonly T[]) => ReactNode;
};

/**
 * Renders trust content only when real entries exist. With an empty list the
 * section disappears in production; in development a dashed, labelled box
 * shows where client-supplied content will go.
 */
export function Slot<T>({ label, source, items, children }: Props<T>) {
  if (items.length > 0) return <>{children(items)}</>;
  if (process.env.NODE_ENV === "production") return null;
  return (
    <div
      role="note"
      className="mono-label my-8 rounded-sm border border-dashed border-chilli/60 px-4 py-6 text-chilli"
    >
      Placeholder: {label}. Hidden in production until entries are added to {source}.
    </div>
  );
}
