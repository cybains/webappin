import { breadcrumbSchema } from "@/lib/structured-data";
import type { ReactNode } from "react";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

const title = "Work in Europe: CV and Job-Search Support | Sufoniq";
const description = "Get help with your CV, job applications and preparing a move to Europe. No Sufoniq fees for job seekers. Our team replies within two business days.";
const pageUrl = `${SITE_URL}/work-in-europe`;

export const metadata = createPageMetadata("/work-in-europe", title, description);

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    breadcrumbSchema("/work-in-europe", "For job seekers"),
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Sufoniq",
      legalName: "UAB Skillaxis",
      url: SITE_URL,
    },
    {
      "@type": "WebPage", breadcrumb: { "@id": `${pageUrl}#breadcrumb` },
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: title,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      description,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#organization` },
      mainEntity: { "@id": `${pageUrl}#service` },
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Job-search and relocation support",
      description: "CV and application support, visa and permit guidance, and practical preparation for working in Europe.",
      url: pageUrl,
      provider: { "@id": `${SITE_URL}/#organization` },
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
