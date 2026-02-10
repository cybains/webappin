export type InsightType = "Visual Dissertation" | "Signals & Patterns" | "Framework Note";

export interface Insight {
  slug: string;
  type: InsightType;
  title: string;
  framing: string;
  readTime?: string;
  date?: string;
  tags?: string[];
  featured?: boolean;
}

import { insightContents } from "@/lib/insights/content";

export const INSIGHTS: Insight[] = insightContents.map((content) => ({
  slug: content.slugParts.join("/"),
  type: content.type,
  title: content.title,
  framing: content.framing,
  readTime: content.readTime,
  date: content.date,
  tags: content.tags,
  featured: content.featured,
}));
