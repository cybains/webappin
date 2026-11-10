import Content from '@/app/(english)/truck-driver-recruitment/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/truck-driver-recruitment'];
export const metadata=createPageMetadata('/cs/truck-driver-recruitment',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="cs" path="/truck-driver-recruitment"/><Content locale="cs"/></>; }
