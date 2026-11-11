import Content from '@/app/(english)/privacy-policy/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/privacy-policy'];
export const metadata={...createPageMetadata('/ro/privacy-policy',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><LocalizedPageSchema locale="ro" path="/privacy-policy"/><Content locale="ro"/></>; }
