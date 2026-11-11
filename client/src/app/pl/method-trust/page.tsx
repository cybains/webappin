import Content from '@/app/(english)/method-trust/page';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/method-trust'];
export const metadata={...createPageMetadata('/pl/method-trust',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="pl" path="/method-trust"/><Content /></>; }
