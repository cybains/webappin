import Content from '@/app/(english)/austria-seasonal-workers/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/austria-seasonal-workers'];
export const metadata=createPageMetadata('/pl/austria-seasonal-workers',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="pl" path="/austria-seasonal-workers"/><Content locale="pl"/></>; }
