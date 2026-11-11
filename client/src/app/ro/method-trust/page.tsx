import Content from '@/app/(english)/method-trust/page';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/method-trust'];
export const metadata={...createPageMetadata('/ro/method-trust',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="ro" path="/method-trust"/><Content /></>; }
