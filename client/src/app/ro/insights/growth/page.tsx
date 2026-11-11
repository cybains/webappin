import GrowthArticle from '@/components/GrowthArticle';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/growth","Creștere economică în Europa și context de recrutare | Sufoniq","PIB, cercetare, mobilitate și inegalitate: analiză vizuală a economiei europene cu date ilustrative marcate explicit.",'article');
export default function Page(){return <GrowthArticle locale="ro"/>;}
