# Spiceman Exports

Website for Spiceman Exports, wholesale trading and export of spices and pulses from Lawspet, Pondicherry. Built with Next.js (App Router), TypeScript and Tailwind CSS v4, deployed on Vercel at https://spicemanexports.com.

The site is built around one journey, from soil to shipment. Home introduces the business and its goods; **Journey** (`/journey`) walks through the eight stops in full. A persistent particle layer (grains, seeds, peppercorns) lives in the root layout and regroups into each page's shape as you scroll and navigate. Photographs sit inside organic masks (leaf, seed, pod, pebble, arch) with a light colour grade so they belong to the same world.

## Local setup

Requirements: Node.js 20.9 or newer, npm.

```bash
npm install
npm run dev      # http://localhost:3000
npm run lint
npm run build && npm start   # production build locally
```

## Environment variables

None are required. The quote form doesn't send email from the server. Once the fields are valid, it opens the message in WhatsApp (either number) or the visitor's email app, and the text can always be copied. Without JavaScript the form falls back to a plain `mailto:` post.

## Editing content

| What | Where |
|---|---|
| Business facts: name, tagline, proprietor, address, phones, email | `src/config/site.ts` |
| Trust content: certifications, testimonials, clients, stats | `src/config/site.ts` (arrays, empty by default) |
| Products: names, origins, grades, forms, packing, MOQ, colours | `src/data/products.ts` |
| Process page stages | `src/content/process.ts` |
| Home page copy | `src/app/page.tsx` |
| Journey page copy | `src/app/journey/page.tsx` |
| Photographs and their credits | `src/assets/photos/`, `src/data/photos.ts` |
| Colours, type scale, motion easing | `src/app/globals.css` (`@theme` block) |

### Products

Each product in `src/data/products.ts` is a typed object. Change any string and the product page, sorting table, spec list, quote form, sitemap and Open Graph image all update. To add a product, copy an entry, give it a unique `slug`, and pick a `silhouette` for its particle shape. `accent` is the spice's own colour. `ink` is a darker version of it that stays readable as text on the cream background (aim for at least 4.5:1 contrast).

Every product currently has `confirm: true`. Origins and grades are the usual Indian trade values (typical growing regions and standard grade names) and still need the business to confirm them. MOQ is "On request" everywhere. HS codes are left out; add `hsCode` to show one on the product page.

### Trust content (certifications, testimonials, clients, stats)

These lists are deliberately empty. While a list is empty, its section is hidden on the live site; in development it shows as a dashed "Placeholder" box so you can see where it will go. Add only entries the business can document, for example:

```ts
certifications: [{ name: "Spices Board of India registration (CRES)", issuer: "Spices Board", id: "…" }],
```

## TODO: replace with the client's own material

Illustrations are generated in code. The photographs in `src/assets/photos` are openly licensed stock (credited in `CREDITS.md`) and are illustrative only. Replace these once real material is available:

- [ ] **Logo**: `public/logo.svg`, `src/app/icon.svg` and `src/components/brand/LogoMark.tsx` hold a placeholder mortar-and-pestle drawn from the business card. Keep the `pestle` group class in `LogoMark` if the opening grind animation should still move it. Also update `src/app/apple-icon.tsx`.
- [ ] **Proprietor portrait** (About page): a leaf with the monogram "SK" (`src/components/about/LeafStage.tsx`). Swap in a photo with `next/image` if one is supplied.
- [ ] **Product photographs**: `src/assets/photos/<product-slug>.jpg` (15 files: sorting-table tags, product pages, Home collage). Replace each with a close-up of the business's own stock, keeping the file name; then update or remove its credit in `src/data/photos.ts` and `CREDITS.md`. Full-frame close-ups (the goods filling the picture) suit the masks best.
- [ ] **Journey photographs**: `src/assets/photos/stage-*.jpg` (soil, harvest, sun, sort, pack, container, port), used on Home, Journey and Process. Swap in the business's own photos of drying, sorting, packing and loading when available.
- [ ] **Open Graph images**: generated from `src/og/render.tsx`. Replace with photography later if you like.
- [ ] **Product data** marked `confirm: true` in `src/data/products.ts`.
- [ ] **Map**: the contact page links to a Google Maps search for the street address. If the business has a Google Business Profile, use its share link in `site.mapQuery` / `MapFacade.tsx`.

## Motion, accessibility and performance notes

- **Particles** (`src/components/motion/particles/engine.ts`): a small custom WebGL2 point renderer with a Canvas2D fallback. It picks a quality tier from the device (cores, memory, data saver, screen size) and halves the particle count if early frames are slow. It stops rendering when a scene has settled or handed off, and when the tab is hidden.
- **Handoff**: particles form a shape, then fade while the crisp SVG version appears. On first load the SVG is already there (server-rendered); after client-side navigation it waits for the particles.
- **Reduced motion**: particles, smooth scroll, pinned and horizontal scenes, and the custom cursor are all switched off. Pages show static SVG stills of each scene, and transitions become short fades.
- **Page transitions** use React's `<ViewTransition>` (built into the Next.js App Router). The particle canvas, header, route line and WhatsApp button have their own transition names, so they stay live and don't cross-fade.
- **Scroll choreography** uses GSAP ScrollTrigger and Lenis, both loaded after the first paint. Pinned elements are always an inner wrapper, never a component's root node, so React can unmount pages cleanly.

## Deploying on Vercel

1. Push this repository to GitHub (it lives at `hkj13/spiceman-exports`).
2. In Vercel, choose **Add New → Project**, import the repository, keep the detected **Next.js** preset, and click **Deploy**. No environment variables or `vercel.json` are needed.
3. Every push to `main` deploys to production; pull requests get preview URLs.

### Pointing spicemanexports.com to Vercel

1. In the Vercel project, open **Settings → Domains** and add `spicemanexports.com` and `www.spicemanexports.com`. Set one to redirect to the other (the site's canonical URLs use `https://spicemanexports.com`, so redirect `www` to the apex).
2. At your domain registrar, create the DNS records Vercel shows. Typically:
   - `A` record for `@` → `76.76.21.21`
   - `CNAME` record for `www` → `cname.vercel-dns.com`

   Or switch the domain's nameservers to Vercel's if you prefer Vercel to manage DNS.
3. Wait for DNS to propagate (minutes to a few hours). Vercel issues the HTTPS certificate automatically.
4. Afterwards, submit `https://spicemanexports.com/sitemap.xml` in Google Search Console.

If the canonical domain ever changes, update `site.url` in `src/config/site.ts`.

## Project structure

```
src/
  app/                 routes, metadata, OG images, sitemap, robots, manifest
  components/
    motion/            particle engine, scene bus, smooth scroll, cursor, reveals
    home/              journey chapters and scenes
    products/          sorting table, pulse pour, product stage, quote CTA
    process/ about/ contact/ layout/ art/ brand/ seo/ placeholder/
  config/site.ts       business facts and trust-content slots
  data/products.ts     product catalogue
  content/process.ts   process stages
  lib/                 quote schema, colour helpers, SEO helper
  og/                  Open Graph renderer and its fonts
```

See `CREDITS.md` for fonts and licences.
