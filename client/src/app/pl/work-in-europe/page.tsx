import Content from '@/app/(english)/work-in-europe/page';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/work-in-europe'];
export const metadata={...createPageMetadata('/pl/work-in-europe',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="pl" path="/work-in-europe"/><Content /></>; }
