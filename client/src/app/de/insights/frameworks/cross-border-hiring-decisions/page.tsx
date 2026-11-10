import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata('/de/insights/frameworks/cross-border-hiring-decisions',"Personal aus dem Ausland: Voraussetzungen klären | Sufoniq","Ein Bewerberpool allein besetzt keine Stelle. Wie Suche, Beschäftigungsvoraussetzungen und Qualifikationen bei internationalen Einstellungen zusammenhängen.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks","cross-border-hiring-decisions"])!} locale="de"/>;}
