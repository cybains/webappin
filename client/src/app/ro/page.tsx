import Content from '@/app/(english)/HomeContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/'];
export const metadata=createPageMetadata('/ro',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="ro" path="/"/><Content locale="ro"/></>; }
