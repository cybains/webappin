import Content from '@/app/(english)/insights/InsightsLanding';
import GermanPageSchema from '@/components/GermanPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {germanPages} from '@/lib/i18n/pages';
const page=germanPages['/insights'];
export const metadata={...createPageMetadata('/de/insights',page.title,page.description)};
export default function Page(){return <><GermanPageSchema path="/insights"/><Content /></>; }
