import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata('/de/insights/signals/country-comparisons',"Wo in Europa arbeiten? Warum Ranglisten täuschen | Sufoniq","Welches europäische Land ist zum Arbeiten am einfachsten? Warum Beruf, Unterlagen, Sprache und Zugangsweg mehr aussagen als pauschale Länderranglisten.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals","country-comparisons"])!} locale="de"/>;}
