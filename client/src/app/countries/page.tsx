import type { Metadata } from "next";
import CountriesClient from "./CountriesClient";
import { GROUPS } from "./data";

export const metadata: Metadata = {
  title: "Countries | Sufoniq",
  description: "Explore the regions and countries we cover so you can plan moves across Europe and neighbours.",
};

export default function CountriesPage() {
  return <CountriesClient initialGroups={GROUPS} />;
}
