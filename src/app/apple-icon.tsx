import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the mortar on paper. TODO(logo): swap for the client's mark. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#FBF7EE" }}>
        <svg width="140" height="140" viewBox="0 0 120 120">
          <path d="M47 55C36 45 36 30 47 20c7 11 8 24 0 35Z" fill="#2E8B3E" />
          <path d="M50 55c2-14 12-24 26-25-3 13-13 22-26 25Z" fill="#1D6A2C" />
          <rect x="68" y="14" width="13" height="50" rx="6.5" transform="rotate(32 74.5 39)" fill="#6B3A22" />
          <path d="M22 60h76c0 21-16 36-38 36S22 81 22 60Z" fill="#6B3A22" />
          <rect x="18" y="55" width="84" height="8" rx="4" fill="#4A2413" />
          <path d="M47 96h26l5 8H42Z" fill="#4A2413" />
          <path d="M98 62c9 9 9 27-8 40 5-11 6-25 1-37Z" fill="#C8231E" />
          <circle cx="30" cy="100" r="4.2" fill="#2B2420" />
          <circle cx="38" cy="104" r="3.6" fill="#3A2F29" />
        </svg>
      </div>
    ),
    size,
  );
}
