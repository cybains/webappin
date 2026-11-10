import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/frameworks/cross-border-hiring-decisions","Nábor ze zahraničí: lidé, povolení a kvalifikace | Sufoniq","Samotný okruh uchazečů pozici neobsadí. Jak propojit hledání, oprávnění k zaměstnání a kvalifikační požadavky před náborem ze zahraničí.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks","cross-border-hiring-decisions"])!} locale="cs"/>;}
