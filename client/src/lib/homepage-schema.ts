import { SITE_URL } from "./seo";

// Describe the visible offer; do not imply vacancies, ratings or measured results.
export const homepageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sufoniq",
      legalName: "UAB Skillaxis",
      url: SITE_URL,
      description: "Cross-border recruitment and mobility support for European employers.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: "Sufoniq",
      inLanguage: ["en", "de", "cs", "pl", "ro"],
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: `${SITE_URL}/`,
      name: "International Recruitment in Europe | Sufoniq",
      description: "International sourcing, candidate screening and mobility coordination for European employers with hard-to-fill roles.",
      inLanguage: "en",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntity: { "@id": `${SITE_URL}/#employer-service` },
    },
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#employer-service`,
      name: "International recruitment and mobility coordination",
      serviceType: "Candidate sourcing, screening and mobility coordination",
      description: "Support for sourcing and screening candidates and coordinating the agreed document, permit and qualification steps alongside an employer’s hiring process.",
      url: `${SITE_URL}/employers`,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Place", name: "Europe" },
    },
  ],
};
