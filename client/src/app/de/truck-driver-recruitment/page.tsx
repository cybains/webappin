import Content from '@/app/(english)/truck-driver-recruitment/PageContent';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/truck-driver-recruitment'];
export const metadata=createPageMetadata('/de/truck-driver-recruitment',page.title,page.description);
export default function Page() { return <><GermanPageSchema path="/truck-driver-recruitment"/><Content locale="de"/></>; }
