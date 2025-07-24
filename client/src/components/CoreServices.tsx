"use client";

import React from "react";
import {
  Briefcase,
  Globe,
  Building2,
  Users,
  Home,
  Map,
  Laptop,
  HelpCircle,
} from "lucide-react";

type Service = {
  icon: React.ReactElement;
  title: string;
  description: string;
  link: string;
};

const services: Service[] = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "Job Search Support",
    description:
      "We turn your career story into something employers actually want to read. Editorial therapy for your professional life — minus the couch.",
    link: "/services/job-search",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Visa & Immigration Guidance",
    description:
      "Permits, forms, and inexplicable delays — all gently wrestled into order by people who’ve lived to tell the tale.",
    link: "/services/visa",
  },
  {
    icon: <Building2 className="h-8 w-8 text-primary" />,
    title: "Work with Startups & Firms",
    description:
      "We’re always open to hearing from startups and ambitious firms. Let’s chat, plot, and build something delightfully disruptive.",
    link: "/services/startups",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Family Relocation",
    description:
      "From schools to supermarkets, we help you and your crew land softly — tantrums optional, patience included.",
    link: "/services/family",
  },
  {
    icon: <Home className="h-8 w-8 text-primary" />,
    title: "Housing & Bureaucracy",
    description:
      "Rental contracts, tax numbers, utility setup — we decipher the fine print and chase the missing stamp so you don’t have to.",
    link: "/services/housing",
  },
  {
    icon: <Map className="h-8 w-8 text-primary" />,
    title: "Local Orientation",
    description:
      "Not just 'where’s the supermarket?' but decoding customs, avoiding faux pas, and navigating like a seasoned expat.",
    link: "/services/orientation",
  },
  {
    icon: <Laptop className="h-8 w-8 text-primary" />,
    title: "Remote Work Setup",
    description:
      "Digital nomad dreams made livable — with the right visa, the right gear, and a Wi-Fi plan that doesn’t weep under pressure.",
    link: "/services/remote",
  },
  {
    icon: <HelpCircle className="h-8 w-8 text-primary" />,
    title: "Personalized Consultations",
    description:
      "Not sure where to start? Let’s sort things out over a sensible chat — no jargon, no pressure, just helpful plotting.",
    link: "/services/consultation",
  },
];

export default function CoreServices() {
  return (
    <section
      className="py-16 px-4"
      style={{ backgroundColor: "var(--background)" }}
      id="services"
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2
          className="text-3xl font-bold mb-4"
          style={{ color: "var(--foreground)" }}
        >
          Our Core Services
        </h2>
        <p
          className="text-gray-600 dark:text-gray-300 mb-10"
          style={{ color: "var(--foreground)" }}
        >
          A delightful range of grown-up assistance — from decoding visa forms
          to unbungling the job market.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow hover:shadow-lg transition-all"
              style={{
                backgroundColor: "var(--background)",
                color: "var(--foreground)",
                border: "1px solid var(--primary)",
              }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3
                className="text-xl font-semibold mb-2"
                style={{ color: "var(--foreground)" }}
              >
                {service.title}
              </h3>
              <p className="text-sm mb-4" style={{ color: "var(--foreground)" }}>
                {service.description}
              </p>
              <a
                href={service.link}
                className="text-primary font-medium hover:underline text-sm"
                style={{ color: "var(--primary)" }}
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
