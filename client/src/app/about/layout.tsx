import type { ReactNode } from "react";
import { createPageMetadata, SITE_URL } from "@/lib/seo";

const title = "About Sufoniq | Recruitment & Mobility in Europe";
const description = "Learn about Sufoniq’s origins, multinational team and working principles, with registration and contact details for UAB Skillaxis, our operating company.";
const pageUrl = `${SITE_URL}/about`;
export const metadata = createPageMetadata("/about", title, description);
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: "Sufoniq", legalName: "UAB Skillaxis", url: SITE_URL, email: "support@sufoniq.com", identifier: { "@type": "PropertyValue", propertyID: "Lithuanian company code", value: "307395574" } },
    { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "Sufoniq", url: SITE_URL, publisher: { "@id": `${SITE_URL}/#organization` } },
    { "@type": "AboutPage", "@id": `${pageUrl}#webpage`, name: title, description, url: pageUrl, inLanguage: "en", isPartOf: { "@id": `${SITE_URL}/#website` }, mainEntity: { "@id": `${SITE_URL}/#organization` }, publisher: { "@id": `${SITE_URL}/#organization` } },
  ],
};

export default function PageLayout({ children }: { children: ReactNode }) {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />{children}</>;
}
