import type {Metadata} from 'next';
import {notFound} from 'next/navigation';
import {createPageMetadata} from '@/lib/seo';
import {insightSnippet} from '@/lib/insights/seo';
import {getInsightBySlug} from '@/lib/insights/content';
import Article from '@/components/InsightArticle';
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const slugParts = slug ?? [];
  const insight = getInsightBySlug(slugParts);
  if (!insight) return {};

  const snippet = insightSnippet(insight.slug, insight.title, insight.framing);
  return createPageMetadata(
    "/insights/" + insight.slugParts.join("/"),
    snippet.title,
    snippet.description,
    "article",
  );
}


export default async function Page({params}:{params:Promise<{slug?:string[]}>}){const {slug}=await params;const insight=getInsightBySlug(slug??[]);if(!insight)notFound();return <Article insight={insight}/>;}
