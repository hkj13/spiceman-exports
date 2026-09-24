/**
 * TODO(logo): placeholder mark drawn from the business card (mortar and
 * pestle, leaves, chilli, peppercorns). Replace with the client's vector
 * logo when supplied; keep the group ids if the intro animation should
 * still grind the pestle.
 */
type Props = {
  className?: string;
  title?: string;
  /** Render only the bowl/pestle, without the ring (for tight spaces) */
  compact?: boolean;
};

export function LogoMark({ className, title, compact = false }: Props) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {!compact && (
        <path
          d="M24 30 A52 52 0 1 1 18 86"
          fill="none"
          stroke="#1D6A2C"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
      )}
      {/* leaves behind the bowl */}
      <path d="M47 55C36 45 36 30 47 20c7 11 8 24 0 35Z" fill="#2E8B3E" />
      <path d="M50 55c2-14 12-24 26-25-3 13-13 22-26 25Z" fill="#1D6A2C" />
      <path d="M47 55c-1-12 0-22 0-35" stroke="#12361C" strokeWidth="1.2" fill="none" opacity=".5" />
      {/* pestle */}
      <g id="pestle">
        <rect x="68" y="14" width="13" height="50" rx="6.5" transform="rotate(32 74.5 39)" fill="#6B3A22" />
        <ellipse cx="88" cy="17" rx="7.5" ry="6" transform="rotate(32 88 17)" fill="#5A2E1A" />
      </g>
      {/* bowl */}
      <path d="M22 60h76c0 21-16 36-38 36S22 81 22 60Z" fill="#6B3A22" />
      <path d="M26 66h68c-2 5-5 9-9 13H35c-4-4-7-8-9-13Z" fill="#5A2E1A" opacity=".55" />
      <rect x="18" y="55" width="84" height="8" rx="4" fill="#4A2413" />
      <path d="M47 96h26l5 8H42Z" fill="#4A2413" />
      {/* chilli */}
      <path d="M98 62c9 9 9 27-8 40 5-11 6-25 1-37Z" fill="#C8231E" />
      <path d="M96 63c1-4 4-6 8-6" stroke="#2E8B3E" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* peppercorns and a coriander seed */}
      <circle cx="30" cy="100" r="4.2" fill="#2B2420" />
      <circle cx="38" cy="104" r="3.6" fill="#3A2F29" />
      <circle cx="24" cy="93" r="3.4" fill="#2B2420" />
      <circle cx="84" cy="106" r="3.2" fill="#B99459" />
    </svg>
  );
}
