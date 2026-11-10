import Content from '@/app/(english)/about/PageContent';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/about'];
export const metadata={...createPageMetadata('/de/about',page.title,page.description)};
export default function Page(){return <><GermanPageSchema path="/about"/><Content locale="de"/></>; }
