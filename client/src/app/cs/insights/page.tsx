import Content from '@/app/(english)/insights/InsightsLanding';
import LocalizedPageSchema from '@/components/LocalizedPageSchema';
import {createPageMetadata} from '@/lib/seo';
import {czechPages} from '@/lib/i18n/pages';
const page=czechPages['/insights'];
export const metadata={...createPageMetadata('/cs/insights',page.title,page.description)};
export default function Page(){return <><LocalizedPageSchema locale="cs" path="/insights"/><Content /></>; }
