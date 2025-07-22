"use client";

import { Briefcase, Globe, Building2, Users } from "lucide-react";

type Service = {
  icon: JSX.Element;
  title: string;
  description: string;
  link: string;
};

const services: Service[] = [
  {
    icon: <Briefcase className="h-8 w-8 text-primary" />,
    title: "Job Search Support",
    description: "Refine your CV, navigate the job market, and get matched with top employers.",
    link: "/services/job-search",
  },
  {
    icon: <Globe className="h-8 w-8 text-primary" />,
    title: "Visa & Immigration",
    description: "Guidance through the visa process tailored to your needs and goals.",
    link: "/services/visa",
  },
  {
    icon: <Building2 className="h-8 w-8 text-primary" />,
    title: "Business Setup",
    description: "Launch your business in Portugal with expert legal and admin support.",
    link: "/services/business",
  },
  {
    icon: <Users className="h-8 w-8 text-primary" />,
    title: "Family Relocation",
    description: "Support for housing, schooling, and settling your family in a new country.",
    link: "/services/family",
  },
];

export default function CoreServices() {
  return (
    <section className="py-16 px-4" style={{ backgroundColor: 'var(--background)' }} id="services">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4" style={{ color: 'var(--foreground)' }}>Our Core Services</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-10" style={{ color: 'var(--foreground)' }}>
          Tailored solutions to match your journey in Portugal and beyond.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 rounded-2xl shadow hover:shadow-lg transition-all"
              style={{
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                border: '1px solid var(--primary)',
              }}
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                {service.title}
              </h3>
              <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                {service.description}
              </p>
              <a
                href={service.link}
                className="text-primary font-medium hover:underline text-sm"
                style={{ color: 'var(--primary)' }}
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
