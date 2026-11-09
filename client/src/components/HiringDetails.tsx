import { ChevronDown } from "lucide-react";
import Link from "next/link";
import styles from "./EmployerPanels.module.css";

const steps = [
  ["Define the role", "Start with the work, required skills, pay, location and target start date. Clarify what has made the vacancy difficult to fill."],
  ["Agree the work and responsibilities", "Set the sourcing and screening scope, costs and who handles each action. Agree the first delivery step in writing."],
  ["Plan the search", "Compare recruitment markets and agree how to reach candidates whose experience fits the requirement."],
  ["Check requirements early", "Identify right-to-work, document, language and qualification checks for the role and candidate, including what still needs verification."],
  ["Connect the steps to starting work", "Bring screening, your hiring decisions and the agreed mobility work into one plan, with owners and timing dependencies. You retain the hiring decision."],
];

export default function HiringDetails() {
  return (
    <section className="relative z-10 mx-auto max-w-6xl px-6 pb-16 md:px-8">
      <details className={styles.details}>
        <summary className={styles.summary}>
          <div><strong>How we plan a cross-border hire</strong><p>Explore the five stages, from your requirement to the planned start.</p></div>
          <ChevronDown className={styles.chevron} aria-hidden="true" />
        </summary>
        <div className={styles.detailBody}>
          <ol>{steps.map(([title, body], index) => <li key={title} className={styles.step}><span aria-hidden="true">{index + 1}</span><div><h3>{title}</h3><p>{body}</p></div></li>)}</ol>
          <Link href="/method-trust" className={styles.detailLink}>Read our method and responsibilities →</Link>
        </div>
      </details>
    </section>
  );
}
