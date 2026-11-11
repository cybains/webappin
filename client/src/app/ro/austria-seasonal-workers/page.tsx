import Content from '@/app/(english)/austria-seasonal-workers/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/austria-seasonal-workers'];
export const metadata=createPageMetadata('/ro/austria-seasonal-workers',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="ro" path="/austria-seasonal-workers"/><Content locale="ro"/></>; }
