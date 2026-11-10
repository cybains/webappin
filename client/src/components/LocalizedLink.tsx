import Link from 'next/link';
import { localizedHref, type Locale } from '@/lib/i18n/shared';
import type { ComponentProps } from 'react';
type Props = Omit<ComponentProps<typeof Link>, 'href'> & {href: string; locale?: Locale};
export default function LocalizedLink({href,locale='en',children,...props}:Props) { const destination=localizedHref(href,locale); const untranslated=locale==='de' && href.startsWith('/') && !href.startsWith('/de') && destination===href; return <Link {...props} aria-label={untranslated && props["aria-label"] ? props["aria-label"]+" (Englisch)" : props["aria-label"]} href={destination} hrefLang={untranslated?'en':locale}>{children}{untranslated && <> <span className="ml-1 text-xs font-normal">(Englisch)</span></>}</Link>; }
