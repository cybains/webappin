import { createPageMetadata } from "@/lib/seo";
import HiringInPracticeContent from "./HiringInPracticeContent";

export const metadata = createPageMetadata(
  "/hiring-in-practice",
  "Cross-border Hiring in Practice | Sufoniq",
  "Explore Sufoniq’s approach to overseas sourcing, candidate eligibility and qualification requirements, with clear responsibilities and scoped deliverables.",
);

export default function HiringInPracticePage() {
  return <HiringInPracticeContent />;
}
