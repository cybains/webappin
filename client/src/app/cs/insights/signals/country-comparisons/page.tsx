import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/signals/country-comparisons","Kde je v Evropě nejsnazší najít práci? | Sufoniq","Porovnávejte země podle svého povolání, podmínek, zaměstnavatele a termínu. Proč obecný žebříček neurčí váš postup k práci v Evropě.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals","country-comparisons"])!} locale="cs"/>;}
