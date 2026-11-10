import Content from '@/app/(english)/about/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/about'];
export const metadata={...createPageMetadata('/cs/about',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="cs" path="/about"/><Content locale="cs"/></>; }
