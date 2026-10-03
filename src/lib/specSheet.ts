import { readFile } from "node:fs/promises";
import { join } from "node:path";
import fontkit from "@pdf-lib/fontkit";
import { PDFDocument, PDFName, PDFString, rgb, type PDFFont, type PDFPage, type RGB } from "pdf-lib";
import sharp from "sharp";
import { site, whatsappLink } from "@/config/site";
import { categoryLabel, type Product } from "@/data/products";
import { accentPalette } from "@/lib/color";

/**
 * The downloadable A4 specification sheet for a product, built at deploy
 * time in the website's own look: cream paper, deep green bands, turmeric
 * accents, Fraunces display type, Schibsted Grotesk text and IBM Plex Mono
 * labels.
 */

const hex = (h: string) => {
  const n = parseInt(h.replace("#", ""), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/**
 * Where the PDF's links point. On Vercel this is the production address
 * (the vercel.app URL now, the custom domain once it's connected); locally
 * it falls back to the canonical site URL.
 */
const liveUrl = () =>
  process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : site.url;

/** A clickable area on the page that opens a URL. */
function addLink(doc: PDFDocument, page: PDFPage, x: number, y: number, w: number, h: number, url: string) {
  const annot = doc.context.register(
    doc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + w, y + h],
      Border: [0, 0, 0],
      A: { Type: "Action", S: "URI", URI: PDFString.of(url) },
    }),
  );
  const annots = page.node.lookup(PDFName.of("Annots"));
  if (annots && "push" in annots) (annots as { push: (r: typeof annot) => void }).push(annot);
  else page.node.set(PDFName.of("Annots"), doc.context.obj([annot]));
}

const C = {
  paper: hex("#FBF7EE"),
  paper2: hex("#F2EAD8"),
  tag: hex("#F6ECD6"),
  rule: hex("#DDCFB4"),
  ink: hex("#2A1810"),
  brown: hex("#5A2E1A"),
  green: hex("#1D6A2C"),
  green900: hex("#12361C"),
  paperOnGreen: hex("#C9D3CA"),
  turmeric: hex("#E3A21A"),
  chilli: hex("#BF201B"),
};

// Keep to characters the embedded Latin fonts can draw.
const clean = (s: string) =>
  s
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x20-\x7E -ÿ–—·•…↗→]/g, "");

function wrap(text: string, font: PDFFont, size: number, width: number) {
  const words = clean(text).split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const next = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) > width && line) {
      lines.push(line);
      line = w;
    } else line = next;
  }
  if (line) lines.push(line);
  return lines;
}

/** Letter-spaced uppercase label, like the site's `mono-label`. */
function label(page: PDFPage, text: string, x: number, y: number, size: number, font: PDFFont, color: RGB, alignRight = false) {
  const t = clean(text).toUpperCase();
  const spacing = size * 0.12;
  const width = [...t].reduce((w, ch) => w + font.widthOfTextAtSize(ch, size) + spacing, -spacing);
  let cx = alignRight ? x - width : x;
  for (const ch of t) {
    page.drawText(ch, { x: cx, y, size, font, color });
    cx += font.widthOfTextAtSize(ch, size) + spacing;
  }
  return width;
}

/** The mortar-and-pestle mark from the site logo. */
function drawMark(page: PDFPage, x: number, y: number, s: number, ring = true) {
  const o = { x, y, scale: s };
  if (ring) page.drawSvgPath("M24 30 A52 52 0 1 1 18 86", { ...o, borderColor: hex("#2E8B3E"), borderWidth: 4.5 * s });
  page.drawSvgPath("M47 55C36 45 36 30 47 20c7 11 8 24 0 35Z", { ...o, color: hex("#2E8B3E") });
  page.drawSvgPath("M50 55c2-14 12-24 26-25-3 13-13 22-26 25Z", { ...o, color: hex("#3E9B4E") });
  // pestle
  page.drawSvgPath("M64 56 86 20a6.5 6.5 0 0 1 11 7L75 63Z", { ...o, color: hex("#8A5236") });
  page.drawSvgPath("M22 60h76c0 21-16 36-38 36S22 81 22 60Z", { ...o, color: hex("#8A5236") });
  page.drawSvgPath("M18 59a4 4 0 0 1 4-4h76a4 4 0 0 1 0 8H22a4 4 0 0 1-4-4Z", { ...o, color: hex("#6B3A22") });
  page.drawSvgPath("M47 96h26l5 8H42Z", { ...o, color: hex("#6B3A22") });
  page.drawSvgPath("M98 62c9 9 9 27-8 40 5-11 6-25 1-37Z", { ...o, color: hex("#C8231E") });
}

/** A small heap of grains in the product's own colours, as on the sorting table. */
function drawHeap(page: PDFPage, cx: number, base: number, w: number, h: number, colors: string[], seed: number) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const cols = colors.map(hex);
  for (let i = 0; i < 140; i++) {
    let u = 0;
    for (let t = 0; t < 10; t++) {
      u = rnd() * 2 - 1;
      if (rnd() < Math.pow(1 - u * u, 1.4)) break;
    }
    const height = h * Math.pow(Math.max(0, 1 - u * u), 1.4) * Math.sqrt(rnd());
    page.drawCircle({ x: cx + (u * w) / 2, y: base + height, size: 1.4 + rnd() * 1.1, color: cols[i % cols.length] });
  }
}

export async function specSheetPdf(p: Product, photoPath?: string) {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle(`${p.name} specification sheet · ${site.name}`);
  doc.setAuthor(site.name);
  doc.setSubject(`${p.name} (${p.botanical}): wholesale and export specification`);
  doc.setKeywords([p.name, ...p.alsoKnownAs, categoryLabel(p.category), "export", "wholesale", "India"]);
  doc.setCreator(site.name);
  doc.setProducer(site.name);

  const dir = join(process.cwd(), "src/og/fonts");
  const font = async (f: string) => doc.embedFont(await readFile(join(dir, f)), { subset: true });
  const display = await font("fraunces-latin-400-normal.ttf");
  const displayItalic = await font("fraunces-latin-400-italic.ttf");
  const text = await font("schibsted-grotesk-latin-400-normal.ttf");
  const textBold = await font("schibsted-grotesk-latin-600-normal.ttf");
  const mono = await font("ibm-plex-mono-latin-400-normal.ttf");

  const W = 595.28;
  const H = 841.89;
  const M = 46;
  const page = doc.addPage([W, H]);
  const accent = hex(p.accent);
  const accentInk = hex(p.ink);

  // Paper, with the same warm light as the site
  page.drawRectangle({ x: 0, y: 0, width: W, height: H, color: C.paper });
  page.drawCircle({ x: 40, y: H + 40, size: 360, color: hex("#FFF4D6"), opacity: 0.55 });

  /* ---------------- Header band ---------------- */
  const HB = 86;
  page.drawRectangle({ x: 0, y: H - HB, width: W, height: HB, color: C.green900 });
  drawMark(page, M - 6, H - 20, 0.44);
  page.drawText("Spiceman", { x: M + 50, y: H - 47, size: 21, font: display, color: C.paper });
  label(page, "Exports", M + 51, H - 62, 7, mono, C.turmeric);
  label(page, "Specification sheet", W - M, H - 44, 8, mono, C.paper, true);
  label(page, `${categoryLabel(p.category)} · wholesale and export`, W - M, H - 58, 6.5, mono, C.paperOnGreen, true);
  // a turmeric hairline under the band, like the site's route line
  page.drawRectangle({ x: 0, y: H - HB - 3, width: W, height: 3, color: C.turmeric });

  /* ---------------- Title ---------------- */
  const photoW = 186;
  const photoH = 150;
  const topY = H - HB - 34;
  const titleW = W - 2 * M - photoW - 26;

  // chapter label: rule + text, as on the site
  page.drawRectangle({ x: M, y: topY + 2.5, width: 22, height: 0.8, color: C.brown });
  label(page, `${categoryLabel(p.category)} · ${p.slug.replace(/-/g, " ")}`, M + 30, topY, 7, mono, C.brown);

  let y = topY - 46;
  let size = 42;
  const name = clean(p.name);
  // allow two lines for long names
  let nameLines = [name];
  while (display.widthOfTextAtSize(name, size) > titleW && size > 30) size -= 2;
  if (display.widthOfTextAtSize(name, size) > titleW) nameLines = wrap(name, display, size, titleW);
  for (const l of nameLines) {
    page.drawText(l, { x: M - 1.5, y, size, font: display, color: accentInk });
    y -= size * 0.98;
  }
  y += size * 0.98 - 24;
  page.drawText(clean(p.botanical), { x: M, y, size: 14, font: displayItalic, color: C.brown });
  y -= 22;
  for (const l of wrap(p.summary, text, 11, titleW)) {
    page.drawText(l, { x: M, y, size: 11, font: text, color: C.ink });
    y -= 15.5;
  }

  // colour chip with the product's swatch
  y -= 8;
  page.drawCircle({ x: M + 5, y: y + 3.5, size: 5, color: accent });
  page.drawText(clean(p.colour), { x: M + 16, y, size: 9.5, font: text, color: C.brown });

  // Photo (or a grain heap if there isn't one), with an offset turmeric frame
  const px = W - M - photoW;
  const py = topY - photoH + 6;
  page.drawRectangle({ x: px + 6, y: py - 6, width: photoW, height: photoH, color: accent, opacity: 0.85 });
  let placed = false;
  if (photoPath) {
    try {
      const jpg = await sharp(await readFile(photoPath))
        .resize(Math.round(photoW * 4), Math.round(photoH * 4), { fit: "cover" })
        .modulate({ saturation: 0.92 })
        .jpeg({ quality: 84 })
        .toBuffer();
      const img = await doc.embedJpg(jpg);
      page.drawImage(img, { x: px, y: py, width: photoW, height: photoH });
      placed = true;
    } catch {
      /* fall back to the heap */
    }
  }
  if (!placed) {
    page.drawRectangle({ x: px, y: py, width: photoW, height: photoH, color: C.paper2 });
    drawHeap(page, px + photoW / 2, py + 18, photoW * 0.8, photoH * 0.6, accentPalette(p.accent), p.slug.length * 977);
  }

  y = Math.min(y, py - 6) - 30;

  /* ---------------- Specification table ---------------- */
  page.drawRectangle({ x: M, y: y + 2.5, width: 22, height: 0.8, color: C.brown });
  label(page, "Specification", M + 30, y, 7.5, mono, C.brown);
  y -= 10;
  page.drawRectangle({ x: M, y, width: W - 2 * M, height: 1.1, color: C.ink });

  const rows: [string, string][] = [
    ["Also known as", p.alsoKnownAs.join(", ")],
    ["Botanical name", p.botanical],
    [p.category === "spice" ? "Aroma" : "Character", p.aroma.join(", ")],
    ["Origin", p.origin.join("; ")],
    ["Forms", p.forms.join(", ")],
    ["Grades", p.grades.join(", ")],
    ["Packing", p.packaging.join("; ")],
    ["Minimum order", p.moq],
  ];
  if (p.hsCode) rows.push(["HS code", p.hsCode]);
  const keyW = 128;
  const valW = W - 2 * M - keyW - 10;
  rows.forEach(([k, v], i) => {
    const lines = wrap(v, text, 10.5, valW);
    const h = lines.length * 14 + 12;
    if (i % 2 === 1) page.drawRectangle({ x: M, y: y - h, width: W - 2 * M, height: h, color: C.paper2, opacity: 0.7 });
    label(page, k, M + 8, y - 17, 6.8, mono, C.brown);
    lines.forEach((l, j) =>
      page.drawText(l, { x: M + keyW, y: y - 17 - j * 14, size: 10.5, font: k === "Grades" ? textBold : text, color: C.ink }),
    );
    y -= h;
    page.drawRectangle({ x: M, y, width: W - 2 * M, height: 0.5, color: C.rule });
  });

  /* ---------------- Request a quote: links straight to the contact page ---------------- */
  const base = liveUrl();
  const quoteUrl = `${base}/contact?product=${p.slug}`;
  y -= 20;
  const boxH = 92;
  const boxW = W - 2 * M;
  const by = y - boxH;
  // a paper sample tag with a clipped corner and string hole, as on the site
  page.drawSvgPath(`M0 0 H${boxW - 14} L${boxW} 14 V${boxH} H0 Z`, {
    x: M,
    y: y,
    scale: 1,
    color: C.tag,
    borderColor: C.rule,
    borderWidth: 0.6,
  });
  page.drawCircle({ x: M + 22, y: y - 18, size: 4.2, color: C.paper, borderColor: C.brown, borderWidth: 0.6, borderOpacity: 0.5 });
  label(page, "Ready to order?", M + 34, y - 20.5, 7, mono, C.brown);
  page.drawText("Request a quote for", { x: M + 18, y: y - 46, size: 17, font: display, color: C.ink });
  page.drawText(clean(p.name.toLowerCase()), {
    x: M + 18 + display.widthOfTextAtSize("Request a quote for ", 17),
    y: y - 46,
    size: 17,
    font: displayItalic,
    color: accentInk,
  });
  const lead = wrap(
    "Send your quantity, shipping (sea or air) and destination on the enquiry page. The product is filled in for you.",
    text,
    9,
    boxW - 210,
  );
  lead.forEach((l, i) => page.drawText(l, { x: M + 18, y: y - 64 - i * 12, size: 9, font: text, color: C.brown }));
  // button
  const btnText = "Request a quote";
  const btnW = text.widthOfTextAtSize(btnText, 10) + 52;
  const btnH = 30;
  const btnX = M + boxW - btnW - 18;
  const btnY = by + (boxH - btnH) / 2 - 6;
  page.drawRectangle({ x: btnX, y: btnY, width: btnW, height: btnH, color: C.green900 });
  page.drawCircle({ x: btnX, y: btnY + btnH / 2, size: btnH / 2, color: C.green900 });
  page.drawCircle({ x: btnX + btnW, y: btnY + btnH / 2, size: btnH / 2, color: C.green900 });
  page.drawText(btnText, { x: btnX + 14, y: btnY + 10.5, size: 10, font: textBold, color: C.paper });
  // arrow, drawn (the text fonts are subset to Latin)
  const ax = btnX + btnW - 22;
  const ay = btnY + btnH / 2;
  page.drawLine({ start: { x: ax, y: ay }, end: { x: ax + 12, y: ay }, thickness: 1.2, color: C.turmeric });
  page.drawLine({ start: { x: ax + 8, y: ay + 3.5 }, end: { x: ax + 12, y: ay }, thickness: 1.2, color: C.turmeric });
  page.drawLine({ start: { x: ax + 8, y: ay - 3.5 }, end: { x: ax + 12, y: ay }, thickness: 1.2, color: C.turmeric });
  addLink(doc, page, btnX - btnH / 2, btnY, btnW + btnH, btnH, quoteUrl);
  // the whole tag opens the enquiry page too
  addLink(doc, page, M, by, boxW - btnW - 50, boxH, quoteUrl);
  y = by - 14;

  for (const l of wrap(
    "Origins, grades, packing and minimum order are typical values, confirmed at the time of quoting. If you buy to your own specification, share it with your enquiry and the quote is made against it.",
    text,
    8.5,
    W - 2 * M,
  )) {
    page.drawText(l, { x: M, y, size: 8.5, font: text, color: C.brown });
    y -= 12;
  }

  /* ---------------- Footer band ---------------- */
  const FB = 118;
  page.drawRectangle({ x: 0, y: 0, width: W, height: FB, color: C.green900 });
  page.drawRectangle({ x: 0, y: FB, width: W, height: 3, color: C.turmeric });
  page.drawText("Pure spices.", { x: M, y: FB - 36, size: 17, font: display, color: C.paper });
  page.drawText("Better tomorrow.", {
    x: M + display.widthOfTextAtSize("Pure spices. ", 17),
    y: FB - 36,
    size: 17,
    font: displayItalic,
    color: C.turmeric,
  });

  label(page, "Request a quote", M, FB - 58, 6.5, mono, C.turmeric);
  // WhatsApp numbers, email and the product page, each clickable
  let cx = M;
  const wy = FB - 73;
  const wa = "WhatsApp ";
  page.drawText(wa, { x: cx, y: wy, size: 9.5, font: text, color: C.paper });
  cx += text.widthOfTextAtSize(wa, 9.5);
  site.phones.forEach((ph, i) => {
    const t = ph.display;
    const w = text.widthOfTextAtSize(t, 9.5);
    page.drawText(t, { x: cx, y: wy, size: 9.5, font: text, color: C.paper });
    page.drawRectangle({ x: cx, y: wy - 2, width: w, height: 0.5, color: C.paperOnGreen });
    addLink(doc, page, cx, wy - 3, w, 13, whatsappLink(ph, `Hello Spiceman Exports, I would like a quote for ${p.name}.`));
    cx += w;
    if (i < site.phones.length - 1) {
      page.drawText("  ·  ", { x: cx, y: wy, size: 9.5, font: text, color: C.paper });
      cx += text.widthOfTextAtSize("  ·  ", 9.5);
    }
  });
  const links: [string, string][] = [
    [site.email, `mailto:${site.email}?subject=${encodeURIComponent(`Quote request: ${p.name}`)}`],
    [`${base.replace("https://", "")}/products/${p.slug}`, `${base}/products/${p.slug}`],
  ];
  links.forEach(([t, url], i) => {
    const ly = wy - 13 * (i + 1);
    const w = text.widthOfTextAtSize(clean(t), 9.5);
    page.drawText(clean(t), { x: M, y: ly, size: 9.5, font: text, color: C.paper });
    page.drawRectangle({ x: M, y: ly - 2, width: w, height: 0.5, color: C.paperOnGreen });
    addLink(doc, page, M, ly - 3, w, 13, url);
  });

  label(page, "Write or visit", W - M, FB - 58, 6.5, mono, C.turmeric, true);
  const addr = [site.name, ...site.address.lines, `${site.address.locality} ${site.address.postalCode}, ${site.address.country}`];
  addr.forEach((l, i) => {
    const f = i === 0 ? textBold : text;
    const t = clean(l);
    page.drawText(t, { x: W - M - f.widthOfTextAtSize(t, 9), y: FB - 73 - i * 12, size: 9, font: f, color: i === 0 ? C.paper : C.paperOnGreen });
  });

  return doc.save();
}
