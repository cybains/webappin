import Content from '@/app/(english)/work-in-europe/page';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/work-in-europe'];
export const metadata={...createPageMetadata('/de/work-in-europe',page.title,page.description)};
export default function Page(){return <><GermanPageSchema path="/work-in-europe"/><Content /></>; }
