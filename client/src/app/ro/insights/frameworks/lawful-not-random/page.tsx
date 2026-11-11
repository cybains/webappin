import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/frameworks/lawful-not-random","De ce deciziile de imigrație par aleatorii | Sufoniq","Marja de apreciere, verificarea riscului și feedbackul limitat explică de ce sisteme legale de imigrație pot părea greu de înțeles.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["frameworks", "lawful-not-random"])!} locale="ro"/>;}
