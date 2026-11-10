import GrowthArticle from '@/components/GrowthArticle';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata('/de/insights/growth','Wirtschaftswachstum in Europa verstehen | Sufoniq','BIP, Forschung, Mobilität und Verteilung: eine visuelle Einordnung der europäischen Wirtschaft mit klar gekennzeichneten Beispieldaten.','article');
export default function Page(){return <GrowthArticle locale="de"/>;}
