import GrowthArticle from '@/components/GrowthArticle';
import {createPageMetadata} from '@/lib/seo';
import {insightSnippet} from '@/lib/insights/seo';
const snippet=insightSnippet('growth','','');
export const metadata=createPageMetadata('/insights/growth',snippet.title,snippet.description,'article');
export default function Page(){return <GrowthArticle/>;}
