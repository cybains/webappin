import Content from '@/app/(english)/insights/InsightsLanding';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {romanianPages} from '@/lib/i18n/pages';
const page=romanianPages['/insights'];
export const metadata={...createPageMetadata('/ro/insights',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="ro" path="/insights"/><Content /></>; }
