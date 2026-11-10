import Article from '@/components/InsightArticle';
import {getInsightBySlug} from '@/lib/insights/content';
import {createPageMetadata} from '@/lib/seo';
export const metadata=createPageMetadata('/de/insights/rules/lithuania-foreign-worker-quota-2026',"Litauens Arbeitskräftequote 2026: Was jetzt gilt | Sufoniq","Was Arbeitgeber nach Ausschöpfung von Litauens Quote 2026 prüfen sollten: Gehaltsbedingungen, Aufenthaltsstatus und Einreichungsregeln ab November.",'article');
export default function Page(){return <Article insight={getInsightBySlug(["rules","lithuania-foreign-worker-quota-2026"])!} locale="de"/>;}
