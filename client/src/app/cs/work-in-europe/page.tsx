import Content from '@/app/(english)/work-in-europe/page';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/work-in-europe'];
export const metadata={...createPageMetadata('/cs/work-in-europe',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="cs" path="/work-in-europe"/><Content /></>; }
