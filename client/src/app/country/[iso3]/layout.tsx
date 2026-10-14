import type { Metadata } from "next";
import type { ReactNode } from "react";
import { GROUPS } from "@/app/countries/data";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ iso3: string }> }): Promise<Metadata> {
  const { iso3 } = await params;
  const code = iso3.toUpperCase();
  const country = GROUPS.flatMap(group => group.countries).find(item => item.code === code);
  const name = country?.name ?? code;
  return createPageMetadata("/country/" + encodeURIComponent(code), name + " Country Brief | Sufoniq", "Explore " + name + " economic and labour-market context, indicators and country insights. These figures provide context rather than confirmation of eligibility.");
}

export default function CountryLayout({ children }: { children: ReactNode }) {
  return children;
}
