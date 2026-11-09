import { breadcrumbSchema } from "@/lib/structured-data";
import type { ReactNode } from "react";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

const title = "Screened Candidates & Cross-Border Recruitment | Sufoniq";
const description = "Find candidates screened for your role, with interest and availability confirmed. Sufoniq connects recruitment with the steps needed before an international start.";
const pageUrl = `${SITE_URL}/employers`;

export const metadata = createPageMetadata("/employers", title, description);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbSchema("/employers", "For employers"),
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sufoniq",
      legalName: "UAB Skillaxis",
      url: SITE_URL,
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "Sufoniq",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebPage", breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      description,
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
      description: "Candidate sourcing and shortlisting against agreed role criteria, with interest and availability confirmed and completed and outstanding checks recorded. Document, permit and qualification coordination is agreed for each engagement.",
      url: pageUrl,
      mainEntityOfPage: { "@id": `${pageUrl}#webpage` },
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: { "@type": "Place", name: "Europe" },
      audience: { "@type": "BusinessAudience", audienceType: "European employers" },
    },
  ],
};

export default function PageLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      {children}
    </>
  );
}
