"use client";
import demand from "@/data/hiring-demand-map.json";
import styles from "./WorkforceNetwork.module.css";

const NODES = [
  { id: "employers", label: "Employers", x: 440, y: 105, group: "demand", text: "Workforce requirements connect roles, working conditions, headcount and timing. Those requirements shape sourcing, screening and the route to starting work." },
  { id: "demand", label: "Hiring demand", x: 210, y: 80, group: "demand", text: "Vacancy statistics provide context for unfilled demand. The relevant sector, role and destination still need assessment; national rates alone do not establish a recruitment opportunity." },
  { id: "skills", label: "Skills & qualifications", x: 685, y: 85, group: "people", text: "The skills a role requires connect employer needs with candidate experience, screening and any training or recognition requirements." },
  { id: "sourcing", label: "Candidate sourcing", x: 140, y: 240, group: "people", text: "Sourcing options depend on the job requirements, candidate availability and relevant partners. Availability needs to be considered alongside eligibility and timing." },
  { id: "candidates", label: "Candidates", x: 390, y: 255, group: "people", text: "Candidate experience, preferences, documents and readiness influence screening, contracts, mobility and the practical start date." },
  { id: "screening", label: "Screening", x: 645, y: 240, group: "people", text: "Screening connects role requirements with candidate evidence. Qualifications, experience and open verification questions inform the employer’s hiring decision." },
  { id: "partners", label: "Local partners", x: 70, y: 420, group: "delivery", text: "Relevant local partners connect sourcing and delivery with destination-specific requirements. Responsibilities and any licensing requirements depend on the agreed project scope." },
  { id: "documents", label: "Documentation", x: 300, y: 440, group: "requirements", text: "Document requirements connect candidate evidence with eligibility, contracts and applications. Missing or inconsistent evidence can affect several parts of the route." },
  { id: "eligibility", label: "Eligibility & permits", x: 535, y: 405, group: "requirements", text: "Eligibility depends on the destination, role and candidate circumstances. Verification and decisions by authorities influence documentation and mobility timing." },
  { id: "training", label: "Training & recognition", x: 805, y: 345, group: "requirements", text: "Where a role requires training or qualification recognition, those steps connect skills and screening with readiness to begin work." },
  { id: "contracts", label: "Contracts & conditions", x: 790, y: 165, group: "requirements", text: "Working conditions and agreed responsibilities connect the employer’s requirement with candidate expectations, documentation and onboarding." },
  { id: "mobility", label: "Mobility", x: 630, y: 535, group: "delivery", text: "Mobility connects verified requirements with travel and arrival preparation. It depends on documentation, employer readiness and the relevant decisions by authorities." },
  { id: "onboarding", label: "Arrival & onboarding", x: 825, y: 495, group: "delivery", text: "Arrival and onboarding bring the hiring route into the workplace. Employer preparation, any required training and agreed practical support need to align." },
] as const;
const EDGES = [
  ["demand", "employers"], ["demand", "sourcing"], ["employers", "skills"], ["employers", "screening"],
  ["employers", "contracts"], ["employers", "onboarding"], ["sourcing", "candidates"], ["sourcing", "partners"],
  ["candidates", "skills"], ["candidates", "screening"], ["candidates", "documents"], ["candidates", "contracts"],
  ["skills", "screening"], ["skills", "training"], ["screening", "eligibility"], ["screening", "documents"],
  ["partners", "documents"], ["partners", "mobility"], ["documents", "eligibility"], ["documents", "contracts"],
  ["eligibility", "mobility"], ["training", "onboarding"], ["contracts", "onboarding"], ["mobility", "onboarding"],
] as const;

export default function WorkforceNetworkGraph({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const setSelected = onSelect;
  const current = NODES.find(node => node.id === selected)!;
  const related = new Set<string>(EDGES.flatMap(([a, b]) => a === selected ? [b] : b === selected ? [a] : []));

  return (
      <div className={styles.explorer}>
        <div className={styles.graphSide}>
          <div className={styles.legend}><span>Amber · demand</span><span>Blue · people</span><span>Violet · requirements</span><span>Green · delivery</span></div>
          <p className={styles.mobileHint}>Select a node below. You can scroll the network horizontally.</p>
          <div className={styles.graphScroll}>
            <svg viewBox="0 0 920 600" className={styles.graph} role="group" aria-label="Interactive workforce dependency network">
              {EDGES.map(([a, b]) => {
                const from = NODES.find(node => node.id === a)!;
                const to = NODES.find(node => node.id === b)!;
                const active = a === selected || b === selected;
                return <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={active ? styles.activeEdge : styles.edge} />;
              })}
              {NODES.map(node => <g key={node.id} role="button" tabIndex={0} aria-pressed={selected === node.id} aria-label={`Explore ${node.label}`} onClick={() => setSelected(node.id)} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(node.id); } }} className={`${styles.node} ${styles[node.group]} ${selected === node.id ? styles.selected : related.has(node.id) ? styles.related : styles.quiet}`}>
                <circle cx={node.x} cy={node.y} r="25" className={styles.hitArea} />
                <circle cx={node.x} cy={node.y} r="19" className={styles.halo} />
                <circle cx={node.x} cy={node.y} r="7" className={styles.dot} />
                <text x={node.x} y={node.y + 42} textAnchor="middle">{node.label}</text>
              </g>)}
            </svg>
          </div>
          <div className={styles.nodeButtons}>{NODES.map(node => <button key={node.id} type="button" aria-pressed={selected === node.id} onClick={() => setSelected(node.id)}>{node.label}</button>)}</div>
          <p className={styles.note}>Conceptual dependencies—not measured migration flows or a statement of service coverage.</p>
        </div>
        <aside className={styles.details} aria-live="polite" aria-atomic="true">
          <p className={styles.eyebrow}>Explore the connections</p><h3>{current.label}</h3><p>{current.text}</p>
          <h4>Connected to</h4><div className={styles.relatedButtons}>{NODES.filter(node => related.has(node.id)).map(node => <button type="button" key={node.id} onClick={() => setSelected(node.id)}>{node.label}<span aria-hidden="true">↗</span></button>)}</div>
          <div className={styles.data}><h4>Where vacancy pressure is higher</h4><p>Highest rates among EU members with comparable data · {demand.period}</p><ul>{demand.countries.map(country => <li key={country.code}><span>{country.name}</span><strong>{country.rate}%</strong></li>)}</ul><p>Share of posts unfilled. This is not a direct workforce-shortage measure.</p><a href={demand.sourceUrl} target="_blank" rel="noopener noreferrer">Eurostat source and coverage notes ↗</a></div>
        </aside>
      </div>
  );
}
