/**
 * Business facts and content slots.
 *
 * Everything the site states about Spiceman Exports lives here. The
 * trust-content arrays (certifications, testimonials, clients, stats) are
 * intentionally empty: while a list is empty its section is hidden in
 * production and shown as a labelled placeholder in development. Only add
 * entries the business can document.
 */

export type Phone = {
  /** Human-readable, as printed on the business card */
  display: string;
  /** E.164 without the plus, used for tel: and wa.me links */
  e164: string;
};

export type Certification = { name: string; issuer: string; id?: string; href?: string };
export type Testimonial = { quote: string; name: string; company: string; country: string };
export type Client = { name: string; country: string; logo?: string };
export type Stat = { value: string; label: string };

export const site = {
  name: "Spiceman Exports",
  legalName: "Spiceman Exports",
  tagline: "Pure Spices | Better Tomorrow",
  description:
    "Wholesale trading and export of spices and pulses from Pondicherry, India. Black pepper, turmeric, red chilli, cardamom, cumin, toor dal, moong, urad, chana, masoor and more.",
  url: "https://spicemanexports.com",
  locale: "en_IN",

  proprietor: {
    name: "Shanthi Krishnamurthy",
    role: "Proprietor",
  },

  address: {
    lines: ["No.28, Ground Floor", "Kavikuil Street, Ashok Nagar", "Lawspet"],
    street: "No.28, Ground Floor, Kavikuil Street, Ashok Nagar, Lawspet",
    locality: "Pondicherry",
    region: "Puducherry",
    postalCode: "605008",
    country: "India",
    countryCode: "IN",
  },

  /** Used for the map link and embed. Search query rather than coordinates so nothing is guessed. */
  mapQuery: "Kavikuil Street, Ashok Nagar, Lawspet, Puducherry 605008, India",

  phones: [
    { display: "+91 98945 21812", e164: "919894521812" },
    { display: "+91 87782 62010", e164: "918778262010" },
  ] satisfies Phone[],

  email: "spicemanexports@gmail.com",

  // Trust content: add only what can be documented. Empty = hidden.
  certifications: [] as Certification[],
  testimonials: [] as Testimonial[],
  clients: [] as Client[],
  stats: [] as Stat[],
} as const;

export const nav = [
  { href: "/", label: "Journey", stage: "01" },
  { href: "/products", label: "Products", stage: "02" },
  { href: "/process", label: "Process", stage: "03" },
  { href: "/about", label: "About", stage: "04" },
  { href: "/contact", label: "Get a quote", stage: "05" },
] as const;

/** The eight stages of the soil-to-shipment journey, shared by Home and Process. */
export const stages = [
  { id: "soil", n: "01", label: "Soil" },
  { id: "harvest", n: "02", label: "Harvest" },
  { id: "sun", n: "03", label: "Sun" },
  { id: "sort", n: "04", label: "Sort" },
  { id: "check", n: "05", label: "Check" },
  { id: "pack", n: "06", label: "Pack" },
  { id: "container", n: "07", label: "Container" },
  { id: "port", n: "08", label: "Port" },
] as const;

export const whatsappLink = (phone: Phone, text?: string) =>
  `https://wa.me/${phone.e164}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const mailtoLink = (subject?: string, body?: string) => {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);
  const q = params.toString().replace(/\+/g, "%20");
  return `mailto:${site.email}${q ? `?${q}` : ""}`;
};
