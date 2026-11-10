import Content from '@/app/(english)/employers/EmployerLanding';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/employers'];
export const metadata=createPageMetadata('/cs/employers',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="cs" path="/employers"/><Content locale="cs"/></>; }
