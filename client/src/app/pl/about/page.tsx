import Content from '@/app/(english)/about/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/about'];
export const metadata={...createPageMetadata('/pl/about',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="pl" path="/about"/><Content locale="pl"/></>; }
