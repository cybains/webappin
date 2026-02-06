// This page is an editorial surface.
// It shows how data is interpreted, not what users should do.
// Service positioning must not be added here.
import InsightsLanding from "./InsightsLanding";
import { StructuralGridBand } from "@/components/StructuralGridBand";

export const metadata = {
  title: "Insights | Sufoniq",
  description:
    "Editorial thinking on growth, signals, and frameworks—no hype, just calm observations you can carry into your next decision.",
};

export default function InsightsPage() {
  return (
    <StructuralGridBand>
      <InsightsLanding />
    </StructuralGridBand>
  );
}
