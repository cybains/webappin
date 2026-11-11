import Content from '@/app/(english)/work-in-europe/page';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/work-in-europe'];
export const metadata={...createPageMetadata('/ro/work-in-europe',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="ro" path="/work-in-europe"/><Content /></>; }
