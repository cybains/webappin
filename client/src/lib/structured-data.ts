import { SITE_URL } from "./seo";

export const organizationId = `${SITE_URL}/#organization`;
export const websiteId = `${SITE_URL}/#website`;

// Public company facts only. The founder's personal profile is not a company sameAs.
export const siteIdentitySchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization", "@id": organizationId,
      name: "Sufoniq", legalName: "UAB Skillaxis", url: `${SITE_URL}/`,
      email: "support@sufoniq.com",
      logo: `${SITE_URL}/logo.svg`,
      contactPoint: { "@type": "ContactPoint", email: "support@sufoniq.com", contactType: "customer enquiries", url: `${SITE_URL}/#contact` },
      identifier: { "@type": "PropertyValue", propertyID: "Lithuanian company code", value: "307395574" },
      address: { "@type": "PostalAddress", streetAddress: "Architektų g. 56-101", postalCode: "LT-04111", addressLocality: "Vilnius", addressCountry: "LT" },
    },
    { "@type": "WebSite", "@id": websiteId, name: "Sufoniq", url: `${SITE_URL}/`, inLanguage: ["en", "de", "cs", "pl", "ro"], publisher: { "@id": organizationId } },
  ],
};

export function serializeSchema(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

type Crumb = { name: string; path: string };
export function breadcrumbSchema(path: string, name: string, parents: Crumb[] = []) {
  return {
    "@type": "BreadcrumbList", "@id": `${new URL(path, SITE_URL).href}#breadcrumb`,
    itemListElement: [{ name: "Home", path: "/" }, ...parents, { name, path }].map((crumb, index) => ({
      "@type": "ListItem", position: index + 1, name: crumb.name, item: new URL(crumb.path, SITE_URL).href,
    })),
  };
}

export function pageSchema(path: string, name: string, description: string, type = "WebPage", parents: Crumb[] = []) {
  const url = new URL(path, SITE_URL).href;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": type, "@id": `${url}#webpage`, url, name, description, inLanguage: "en", isPartOf: { "@id": websiteId }, publisher: { "@id": organizationId }, breadcrumb: { "@id": `${url}#breadcrumb` } },
      breadcrumbSchema(path, name, parents),
    ],
  };
}

export function articleSchema(path: string, headline: string, description: string, keywords: string[] = []) {
  const url = new URL(path, SITE_URL).href;
  const page = pageSchema(path, headline, description, "WebPage", [{ name: "Insights", path: "/insights" }]);
  return {
    "@context": "https://schema.org",
    "@graph": [
      ...page["@graph"],
      { "@type": "BlogPosting", "@id": `${url}#article`, headline, description, url,
        mainEntityOfPage: { "@id": `${url}#webpage` },
        author: { "@type": "Organization", "@id": organizationId, name: "Sufoniq", url: `${SITE_URL}/about` },
        publisher: { "@id": organizationId }, inLanguage: "en",
        ...(keywords.length ? { keywords: keywords.join(", ") } : {}),
      },
    ],
  };
}
