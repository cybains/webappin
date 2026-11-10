export type Locale = 'en' | 'de';
// Native names keep the language picker readable before a visitor switches.
export const languageOptions: readonly {code: Locale; name: string}[] = [
  {code: 'en', name: 'English'},
  {code: 'de', name: 'Deutsch'},
];
export type Messages = Record<string, string>;
export const germanPaths = ['/', '/employers', '/truck-driver-recruitment', '/austria-seasonal-workers',"/about","/method-trust","/work-in-europe","/privacy-policy","/terms-conditions","/insights","/insights/frameworks/cross-border-hiring-decisions","/insights/signals/country-comparisons","/insights/rules/lithuania-foreign-worker-quota-2026","/insights/growth","/insights/signals/correct-but-stuck","/insights/frameworks/constraint-stacking","/insights/frameworks/lawful-not-random","/insights/signals/churn-is-signal"] as const;
export function englishPath(path: string) { return path === '/de' ? '/' : path.replace(/^\/de(?=\/|$)/, ''); }
export function localizedHref(href: string, locale: Locale) { const index=href.search(/[?#]/); const path=index<0?href:href.slice(0,index); const suffix=index<0?'':href.slice(index); return locale === 'de' && (germanPaths as readonly string[]).includes(path) ? (path === '/' ? '/de' : '/de'+path) + suffix : href; }
export function translate(messages: Messages, text: string) { const key = text.replace(/\s+/g, ' ').trim(); const value = messages[key]; return value === undefined ? text : (text.startsWith(' ') ? ' ' : '') + value + (text.endsWith(' ') ? ' ' : ''); }

export function contactHref(href:string,locale:Locale,t:(text:string)=>string) { if(locale!=='de')return href; if(href.startsWith('https://wa.me/')) { const url=new URL(href);url.searchParams.set('text',t(url.searchParams.get('text')||"Hello Sufoniq, I'd like to discuss a hiring requirement."));return url.href; } if(href.startsWith('mailto:')&&href.includes('?')) { const url=new URL(href),subject=url.searchParams.get('subject');if(subject)url.searchParams.set('subject',t(subject));return url.href; }return href; }
