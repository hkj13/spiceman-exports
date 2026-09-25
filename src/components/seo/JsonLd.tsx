import { site } from "@/config/site";

/** Organization + LocalBusiness structured data, emitted once in the root layout. */
export function JsonLd() {
  const address = {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: site.address.countryCode,
  };
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${site.url}/#organization`,
        name: site.name,
        url: site.url,
        logo: `${site.url}/logo.svg`,
        email: site.email,
        slogan: site.tagline,
        description: site.description,
        address,
        contactPoint: site.phones.map((p) => ({
          "@type": "ContactPoint",
          telephone: `+${p.e164}`,
          contactType: "sales",
          email: site.email,
        })),
      },
      {
        "@type": "LocalBusiness",
        "@id": `${site.url}/#business`,
        name: site.name,
        url: site.url,
        image: `${site.url}/opengraph-image`,
        logo: `${site.url}/logo.svg`,
        email: site.email,
        telephone: site.phones.map((p) => `+${p.e164}`),
        description: site.description,
        address,
        parentOrganization: { "@id": `${site.url}/#organization` },
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      // Values come from our own config; "<" is escaped so the script can't be closed early.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
