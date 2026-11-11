import Content from '@/app/(english)/terms-conditions/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/terms-conditions'];
export const metadata={...createPageMetadata('/ro/terms-conditions',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><LocalizedPageSchema locale="ro" path="/terms-conditions"/><Content locale="ro"/></>; }
