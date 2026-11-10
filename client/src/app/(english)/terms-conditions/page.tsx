import Content from './PageContent';
import {createPageMetadata} from '@/lib/seo';
export const metadata = {
  ...createPageMetadata("/terms-conditions", "Terms & Conditions | Sufoniq", "Terms for using Sufoniq’s website and arranging recruitment support with UAB Skillaxis, including written agreements, fees, responsibilities and consumer rights."),
  robots: { index: false, follow: true },
};
export default function Page(){return <Content/>;}
