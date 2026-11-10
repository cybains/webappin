import Content from '@/app/(english)/austria-seasonal-workers/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/austria-seasonal-workers'];
export const metadata=createPageMetadata('/cs/austria-seasonal-workers',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="cs" path="/austria-seasonal-workers"/><Content locale="cs"/></>; }
