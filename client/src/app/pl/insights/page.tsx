import Content from '@/app/(english)/insights/InsightsLanding';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {polishPages} from '@/lib/i18n/pages';
const page=polishPages['/insights'];
export const metadata={...createPageMetadata('/pl/insights',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="pl" path="/insights"/><Content /></>; }
