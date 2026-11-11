import Content from '@/app/(english)/truck-driver-recruitment/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/truck-driver-recruitment'];
export const metadata=createPageMetadata('/ro/truck-driver-recruitment',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="ro" path="/truck-driver-recruitment"/><Content locale="ro"/></>; }
