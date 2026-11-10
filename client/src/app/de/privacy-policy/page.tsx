import Content from '@/app/(english)/privacy-policy/PageContent';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/privacy-policy'];
export const metadata={...createPageMetadata('/de/privacy-policy',page.title,page.description),robots:{index:false,follow:true}};
export default function Page(){return <><GermanPageSchema path="/privacy-policy"/><Content locale="de"/></>; }
