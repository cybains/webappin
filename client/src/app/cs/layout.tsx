import SiteShell from '@/components/SiteShell';
import {siteMetadata} from '@/lib/seo';
export const metadata=siteMetadata;
export default function Layout({children}:{children:React.ReactNode}) { return <SiteShell locale="cs">{children}</SiteShell>; }
