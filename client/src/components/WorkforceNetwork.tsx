"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from "./WorkforceNetwork.module.css";

const loadGraph = () => import("./WorkforceNetworkGraph");
const Graph = dynamic(loadGraph, { loading: () => <div role="status" className="mt-6 min-h-[600px] rounded-3xl bg-[#080f1e] p-8 text-slate-200">Loading the connected workforce system…</div> });

export default function WorkforceNetwork() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("employers");
  return (
    <section className={`${styles.section} mx-auto max-w-6xl px-6 py-10`} aria-labelledby="network-title">
      <div className={styles.intro}>
        <div><p className={styles.eyebrow}>The connected workforce system</p><h2 id="network-title">One hire. A whole web of dependencies.</h2><p>A change in one part can affect the route elsewhere. Explore how people, requirements and delivery connect.</p></div>
        <button type="button" onMouseEnter={() => { void loadGraph(); }} onFocus={() => { void loadGraph(); }} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="workforce-network-explorer">{open ? "Close the network" : "Explore the network"}<span aria-hidden="true">{open ? "−" : "↗"}</span></button>
      </div>
      <div id="workforce-network-explorer" hidden={!open}>{open && <Graph selected={selected} onSelect={setSelected} />}</div>
    </section>
  );
}
