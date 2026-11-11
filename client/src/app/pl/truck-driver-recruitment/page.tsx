import Content from '@/app/(english)/truck-driver-recruitment/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/truck-driver-recruitment'];
export const metadata=createPageMetadata('/pl/truck-driver-recruitment',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="pl" path="/truck-driver-recruitment"/><Content locale="pl"/></>; }
