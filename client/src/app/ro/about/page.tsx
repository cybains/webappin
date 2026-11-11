import Content from '@/app/(english)/about/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/about'];
export const metadata={...createPageMetadata('/ro/about',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="ro" path="/about"/><Content locale="ro"/></>; }
