import Content from '@/app/(english)/method-trust/page';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/method-trust'];
export const metadata={...createPageMetadata('/de/method-trust',page.title,page.description)};
export default function Page(){return <><GermanPageSchema path="/method-trust"/><Content /></>; }
