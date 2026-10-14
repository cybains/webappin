import { createPageMetadata } from "@/lib/seo";
import CountriesClient from "./CountriesClient";
import { GROUPS } from "./data";

export const metadata = createPageMetadata("/countries", "Country & Regional Coverage | Sufoniq", "Explore Sufoniq’s country and regional coverage across Europe and neighbouring markets, with economic context and links to country briefs.");

export default function CountriesPage() {
  return <CountriesClient initialGroups={GROUPS} />;
}
