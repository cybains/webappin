export const recruitmentPages = [
  {
    id: "truck-drivers",
    title: "Truck driver recruitment",
    scope: "Transport · Europe",
    description: "Fleet-based candidate screening, qualification planning and employment preparation for transport employers.",
    href: "/truck-driver-recruitment",
  },
  {
    id: "austria-agriculture",
    title: "Seasonal agricultural staffing",
    scope: "Agriculture · Austria",
    description: "Recruitment and preparation for farms, orchards, vineyards and greenhouses in Austria.",
    href: "/austria-seasonal-workers",
  },
] as const satisfies readonly {
  id: string;
  title: string;
  scope: string;
  description: string;
  href: `/${string}`;
}[];
