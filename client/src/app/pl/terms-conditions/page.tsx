import Content from '@/app/(english)/terms-conditions/PageContent';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/terms-conditions'];
export const metadata={...createPageMetadata('/pl/terms-conditions',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><LocalizedPageSchema locale="pl" path="/terms-conditions"/><Content locale="pl"/></>; }
