import Content from '@/app/(english)/employers/EmployerLanding';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/employers'];
export const metadata=createPageMetadata('/ro/employers',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="ro" path="/employers"/><Content locale="ro"/></>; }
