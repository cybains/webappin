import Content from '@/app/(english)/privacy-policy/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/privacy-policy'];
export const metadata={...createPageMetadata('/pl/privacy-policy',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><LocalizedPageSchema locale="pl" path="/privacy-policy"/><Content locale="pl"/></>; }
