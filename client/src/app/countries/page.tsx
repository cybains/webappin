import Image from "next/image";

const countryGroups = [
  {
    id: "digital-nomad",
    title: "Digital Nomad Hotspots",
    image: "/digital-nomad.jpg",
    countries: ["Portugal", "Estonia", "Thailand"],
  },
  {
    id: "expat-family",
    title: "Expat Family Friendly",
    image: "/expat-family.jpg",
    countries: ["Canada", "New Zealand", "Netherlands"],
  },
];

export default function CountriesPage() {
  return (
    <main
      className="py-16 px-4"
      style={{ backgroundColor: "var(--background)", color: "var(--foreground)" }}
    >
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10">
          Curated Country Groups
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {countryGroups.map((group) => (
            <div
              key={group.id}
              className="rounded-2xl overflow-hidden shadow border border-gray-200 bg-white/80 dark:bg-black/20"
            >
              <div className="relative h-40 w-full">
                <Image
                  src={group.image}
                  alt={group.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-4">{group.title}</h2>
                <ul className="space-y-1 text-sm">
                  {group.countries.map((country) => (
                    <li key={country}>{country}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

