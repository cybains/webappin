import Content from '@/app/(english)/employers/EmployerLanding';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/employers'];
export const metadata=createPageMetadata('/pl/employers',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="pl" path="/employers"/><Content locale="pl"/></>; }
