import Content from '@/app/(english)/HomeContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/'];
export const metadata=createPageMetadata('/pl',page.title,page.description);
export default function Page() { return <><LocalizedPageSchema locale="pl" path="/"/><Content locale="pl"/></>; }
