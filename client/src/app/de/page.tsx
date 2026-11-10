import Content from '@/app/(english)/HomeContent';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/'];
export const metadata=createPageMetadata('/de',page.title,page.description);
export default function Page() { return <><GermanPageSchema path="/"/><Content locale="de"/></>; }
