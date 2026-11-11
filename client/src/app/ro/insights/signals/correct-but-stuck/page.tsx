import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/signals/correct-but-stuck","De ce o cerere corectă de ședere poate stagna | Sufoniq","Documentele corecte nu înseamnă mereu progres. Cum influențează cozile, prioritățile și verificările între sisteme timpul de așteptare.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["signals", "correct-but-stuck"])!} locale="ro"/>;}
