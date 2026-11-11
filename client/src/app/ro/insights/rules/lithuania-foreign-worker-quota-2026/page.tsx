import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata("/ro/insights/rules/lithuania-foreign-worker-quota-2026","Cota de lucrători din Lituania 2026: după epuizare | Sufoniq","Angajarea în Lituania după epuizarea cotei: condiții salariale, statutul candidatului și regulile de depunere din noiembrie.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["rules","lithuania-foreign-worker-quota-2026"])!} locale="ro"/>;}
