import GrowthArticle from '@/components/GrowthArticle';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/pl/insights/growth","Wzrost gospodarczy w Europie i kontekst zatrudnienia | Sufoniq","PKB, badania, mobilność i nierówności: wizualna analiza gospodarki europejskiej z wyraźnie oznaczonymi danymi ilustracyjnymi.",'article');
export default function Page(){return <GrowthArticle locale="pl"/>;}
