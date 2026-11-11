import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/signals/country-comparisons","Gdzie najłatwiej znaleźć pracę w Europie? | Sufoniq","Dlaczego rankingi krajów mylą osoby planujące pracę za granicą? Liczą się kwalifikacje, język, dokumenty i wykonalna ścieżka zatrudnienia.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals","country-comparisons"])!} locale="pl"/>;}
