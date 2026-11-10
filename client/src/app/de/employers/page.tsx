import Content from '@/app/(english)/employers/EmployerLanding';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/employers'];
export const metadata=createPageMetadata('/de/employers',page.title,page.description);
export default function Page() { return <><GermanPageSchema path="/employers"/><Content locale="de"/></>; }
