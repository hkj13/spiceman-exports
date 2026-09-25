import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/config/site";

export const ogSize = { width: 1200, height: 630 };

const dir = join(process.cwd(), "src/og/fonts");
const fonts = Promise.all([
  readFile(join(dir, "fraunces-latin-400-normal.woff")),
  readFile(join(dir, "fraunces-latin-400-italic.woff")),
  readFile(join(dir, "ibm-plex-mono-latin-400-normal.woff")),
]);

type Props = {
  eyebrow: string;
  title: string;
  /** Italic accent word appended to the title */
  accent?: string;
  /** Colour of the grain field and accent word */
  color?: string;
};

/** Paper card with a spill of grains: the shared Open Graph image. */
export async function renderOg({ eyebrow, title, accent, color = "#1D6A2C" }: Props) {
  const [serif, serifItalic, mono] = await fonts;

  // A deterministic spill of grains in the lower right.
  let s = title.length * 131 + 7;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const palette = [color, "#5A2E1A", "#2B2420", "#E3A21A", "#B99459"];
  const grains = Array.from({ length: 240 }, () => {
    const u = rnd() * 2 - 1;
    const h = Math.pow(Math.max(0, 1 - u * u), 1.5);
    return {
      x: 900 + u * 280,
      y: 630 - h * 260 * Math.sqrt(rnd()) - 6,
      r: 4 + rnd() * 5,
      c: palette[Math.floor(rnd() * palette.length)],
    };
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#FBF7EE",
          color: "#2A1810",
          position: "relative",
        }}
      >
        {grains.map((g, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: g.x,
              top: g.y,
              width: g.r * 2,
              height: g.r * 2,
              borderRadius: 999,
              background: g.c,
            }}
          />
        ))}
        <div style={{ display: "flex", fontFamily: "Plex", fontSize: 22, letterSpacing: 3, color: "#5A2E1A" }}>
          {eyebrow.toUpperCase()}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", fontFamily: "Fraunces", fontSize: 92, lineHeight: 1.0, maxWidth: 820, letterSpacing: -2 }}>
          {title}
          {accent ? (
            <span style={{ fontStyle: "italic", color, marginLeft: 22 }}>{accent}</span>
          ) : null}
        </div>
        <div style={{ display: "flex", fontFamily: "Plex", fontSize: 22, letterSpacing: 2, color: "#1D6A2C" }}>
          {`${site.name.toUpperCase()} · PONDICHERRY, INDIA`}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Fraunces", data: serif, style: "normal", weight: 400 },
        { name: "Fraunces", data: serifItalic, style: "italic", weight: 400 },
        { name: "Plex", data: mono, style: "normal", weight: 400 },
      ],
    },
  );
}
