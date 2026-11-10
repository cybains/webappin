import Content from '@/app/(english)/HomeContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/'];
export const metadata=createPageMetadata('/cs',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="cs" path="/"/><Content locale="cs"/></>; }
