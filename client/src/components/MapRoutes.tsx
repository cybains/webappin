import MapAnimationGate from "./MapAnimationGate";
import demand from "@/data/hiring-demand-map.json";
import migration from "@/data/hero-migration.json";
import styles from "./MapRoutes.module.css";

function project(lon: number, lat: number) {
  const world = 512 * 2 ** 1.2;
  const mercator = (latitude: number) => (1 - Math.log(Math.tan(latitude * Math.PI / 180) + 1 / Math.cos(latitude * Math.PI / 180)) / Math.PI) / 2;
  return { x: 720 + lon / 360 * world, y: 450 + (mercator(lat) - mercator(20)) * world };
}
const countries: Record<string, { name: string; lon: number; lat: number }> = migration.countries;
const maxFlow = Math.max(...migration.routes.map(route => route.persons));
const ROUTES = migration.routes.map((route, index) => {
  const a = project(countries[route.from].lon, countries[route.from].lat);
  const b = project(countries[route.to].lon, countries[route.to].lat);
  const bend = Math.min(140, Math.hypot(a.x - b.x, a.y - b.y) * .3) + (route.direction === "outbound" ? 24 : 0);
  return { ...route, path: `M${a.x.toFixed(1)} ${a.y.toFixed(1)} Q${((a.x + b.x) / 2).toFixed(1)} ${(Math.min(a.y, b.y) - bend).toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`, width: 1 + 2 * Math.sqrt(route.persons / maxFlow), phase: index * .9 + 3 };
});

export default function MapRoutes() {
  const markerId = "hero-migration";

  return (
    <MapAnimationGate routes={ROUTES.map(route => ({ path: route.path, width: route.width, phase: route.phase, color: route.direction === "inbound" ? "#1767b4" : "#087b78" }))}>
    <svg className={styles.overlay} viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <marker id={`${markerId}-in`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1 L9 5 L0 9" fill="none" stroke="#1767b4" strokeWidth="1.5" /></marker>
        <marker id={`${markerId}-out`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 1 L9 5 L0 9" fill="none" stroke="#087b78" strokeWidth="1.5" /></marker>
      </defs>
      <g>{demand.countries.map(country => <path key={country.code} d={country.shape} fillRule="evenodd" className={styles.country}><title>{`${country.name}: ${country.rate}% job vacancy rate, ${demand.period}`}</title></path>)}</g>
      {ROUTES.map((route, index) => (
        <g key={`${route.from}-${route.to}`} className={`${route.direction === "inbound" ? styles.inbound : styles.outbound} ${index > 5 ? styles.desktopRoute : ""}`}>
          <path d={route.path} className={styles.route} markerEnd={`url(#${markerId}-${route.direction === "inbound" ? "in" : "out"})`}><title>{`${countries[route.from].name} → ${countries[route.to].name}: ${route.persons.toLocaleString("en-US")} people, ${migration.year}${route.status ? ` (${route.status})` : ""}`}</title></path>
        </g>
      ))}
      {Object.entries(countries).map(([key, country]) => {
        const point = project(country.lon, country.lat);
        return <g key={key}>
          <circle cx={point.x} cy={point.y} r="11" className={styles.countryPulse} />
          <circle cx={point.x} cy={point.y} r="3" fill="#375774" opacity=".7" />
          <text x={point.x + 8} y={point.y + 4} className={styles.countryLabel}>{country.name}</text>
        </g>;
      })}
    </svg>
    </MapAnimationGate>
  );
}
