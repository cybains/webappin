import GrowthArticle from '@/components/GrowthArticle';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/cs/insights/growth","Hospodářský růst v Evropě v souvislostech | Sufoniq","HDP, výzkum, mobilita a rozdělení příjmů: vizuální pohled na evropskou ekonomiku s jasně označenými ilustrativními daty.",'article');
export default function Page(){return <GrowthArticle locale="cs"/>;}
