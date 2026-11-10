import Content from '@/app/(english)/privacy-policy/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/privacy-policy'];
export const metadata={...createPageMetadata('/cs/privacy-policy',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><LocalizedPageSchema locale="cs" path="/privacy-policy"/><Content locale="cs"/></>; }
