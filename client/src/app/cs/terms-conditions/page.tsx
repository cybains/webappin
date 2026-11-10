import Content from '@/app/(english)/terms-conditions/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/terms-conditions'];
export const metadata={...createPageMetadata('/cs/terms-conditions',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><LocalizedPageSchema locale="cs" path="/terms-conditions"/><Content locale="cs"/></>; }
