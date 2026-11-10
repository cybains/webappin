import Content from './PageContent';
import {createPageMetadata} from '@/lib/seo';
export const metadata = {
  ...createPageMetadata("/privacy-policy", "Privacy Policy | Sufoniq", "How Sufoniq, operated by UAB Skillaxis, handles recruitment and business enquiries, sharing, retention and your privacy rights."),
  robots: { index: false, follow: true },
};
export default function Page(){return <Content/>;}
