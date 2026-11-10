import Content from '@/app/(english)/austria-seasonal-workers/PageContent';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/austria-seasonal-workers'];
export const metadata=createPageMetadata('/de/austria-seasonal-workers',page.title,page.description);
export default function Page() { return <><GermanPageSchema path="/austria-seasonal-workers"/><Content locale="de"/></>; }
