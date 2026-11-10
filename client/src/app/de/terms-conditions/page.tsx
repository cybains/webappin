import Content from '@/app/(english)/terms-conditions/PageContent';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/terms-conditions'];
export const metadata={...createPageMetadata('/de/terms-conditions',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><GermanPageSchema path="/terms-conditions"/><Content locale="de"/></>; }
