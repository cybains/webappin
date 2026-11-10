import Content from '@/app/(english)/method-trust/page';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/method-trust'];
export const metadata={...createPageMetadata('/cs/method-trust',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="cs" path="/method-trust"/><Content /></>; }
