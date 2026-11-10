# Website localisation

English keeps its original public URLs. The German and Czech sites each include the homepage, employer services, driver recruitment, Austrian seasonal staffing, About, Method & Trust, job-seeker support, Privacy, Terms and the Insights index. All eight Insights articles are translated, including the visual growth essay and its chart labels, captions and accessibility text.

## Structure

- src/app/(english): existing English routes. The route group changes source organisation, not public URLs.
- src/app/de and src/app/cs: thin locale route wrappers with translated metadata and structured data.
- src/components/SiteShell.tsx: shared root layout; sets the HTML language on the server. Separate root layouts keep pages statically renderable without cookie/header detection.
- src/lib/i18n/de.json and cs.json: locale messages keyed by their complete English source text (gettext-style). Change a source sentence and update every translated entry together.
- src/lib/i18n/server.ts: server translations. English client components receive an empty message dictionary; each translated locale receives only its own messages through LocaleProvider.
- src/lib/i18n/shared.ts: locale types, supported locale routes and internal link mapping.
- src/lib/i18n/pages.ts: German and Czech core-page titles and search descriptions.
- src/components/InsightArticle.tsx and src/lib/i18n/insights.ts: shared article rendering and translated fields; URLs, identifiers and block types are preserved.

The build checks literal UI messages, configured UI data and every visible text field in the translated articles. Updating English source copy without its translated entries fails this check. The translated Insights index uses the sourced GDP chart; illustrative charts on the English index are not republished as locale-specific evidence.

Components, styles, forms and the map are shared. Do not copy the English markup into separate German designs. German employer copy uses formal Sie, natural German business language and no additional service promises.

## Terminology

Screening = Vorauswahl anhand vereinbarter Anforderungen; never imply independent certification. Sourcing = Suche/Ansprache passender Bewerber. Work permission in Austrian seasonal copy = Beschäftigungsbewilligung. Qualification recognition = Anerkennung. Availability = Verfügbarkeit, distinct from legal permission to start. Mobility coordination = Vorbereitung/Koordination der Schritte bis zum Arbeitsbeginn, rather than promising relocation services. Keep company names and official identifiers unchanged.

## Adding a translation

1. Translate the complete page and enquiry journey in the target locale dictionary; use t() in shared renderers and localize links through LocalizedLink.
2. Register the locale, supported paths and localized metadata in shared.ts and pages.ts; add its dictionary to server.ts.
3. Add thin locale route wrappers using LocalizedPageSchema and shared content. Translate all article fields and metadata.
4. Verify reciprocal hreflang, self-canonicals, HTML lang, structured data and sitemap inclusion with npm run check:seo.
5. Run npm run check:locales and inspect rendering at 320, 390, 768 and desktop widths. Test forms using intercepted API responses, never real enquiries. Check search, plurals, prepared messages, equivalent-page language switches and legal exclusions.

The German navigation links to the translated core pages. Every Insights article has a paired German URL. Unsupported future routes retain English URLs and are marked (Englisch) until translated. The language switcher changes equivalent pages, with no automatic language redirect. German Privacy and Terms preserve the English text and remain noindex, follow; they are excluded from the sitemap. Independent language/legal review has not been completed. Decorative map labels and underlying data/animation remain unchanged.

The writing-lab editorial record is a single-author translation review, not independent native-speaker certification. No deployment is performed by this change.

The growth essay explicitly labels its four illustrative charts as example data in both languages. The sourced GDP chart retains its data and source attribution.

## Language picker

The header uses LanguageSwitcher.tsx as a right-aligned disclosure with native language names and the active locale marked. languageOptions in shared.ts defines the displayed choices; adding a locale also requires its routing, messages, metadata and actual translated pages. Do not add a selectable language before its equivalent route is available. The picker preserves the current query/hash, supports keyboard opening and Escape/focus return, and closes on outside click or focus leaving the control. No extra dropdown dependency is required.


## Czech version

Czech uses cs (HTML/hreflang), cs_CZ (Open Graph) and /cs URLs. All 18 routes, including eight articles, have equivalents. Legal pages remain noindex, follow and are excluded from the sitemap. Existing English and German public URLs are retained.

localePaths and availableLocales drive language links and metadata. getMessages loads the relevant dictionary. LocalizedPageSchema supports shared German/Czech core schema; GermanPageSchema remains a compatibility export. English source keys remain the dictionary lookup, so Czech is translated from English rather than German. The picker includes Čeština and preserves query/fragment context.

Czech copy uses polite professional forms; employers are primary. Screening = předvýběr podle požadavků, availability = dostupnost, qualification recognition = uznání kvalifikace, professional driver qualification = profesní způsobilost. None imply permission to start. Administrative country facts are preserved, not replaced by Czech-specific rules merely because the language is Czech.

Article counts use Czech singular/few/other forms. Number formatting follows the locale. Long headlines are edited before shrinking fonts or changing layout. Prepared messages avoid gender-specific first-person wording. Sentence-context privacy-link text is separate from standalone titles.

check:locales checks both dictionaries, conditional UI branches, shared defaults and every article field. check:seo checks all three languages, self-canonicals, reciprocal hreflang and legal exclusions. Full Czech source-fidelity/editorial evidence is recorded in the writing-lab project sufoniq-czech-localisation; this remains author-only AI review, not independent native/legal certification. No deployment performed by the agent.

## Automatic homepage language

The bare homepage `/` runs country-based language negotiation in `src/middleware.ts`: CZ → cs; DE/AT → de; other or unknown → en. The hosting edge must supply `x-vercel-ip-country` (Vercel) or `cf-ipcountry` (Cloudflare). No external geolocation request is made, and the application does not store the IP or country. On another host, configure a trusted country header before expecting geolocation to work; absent headers safely mean English. Localhost has no real country signal.

A `sufoniq-language` cookie stores only en/de/cs for up to one year, SameSite=Lax, Secure on HTTPS. A dropdown selection overrides the initial suggestion, including explicitly selecting English. The cookie is readable by the dropdown because it writes the preference before navigating. No account or database is involved.

Only `/` negotiates; `/de`, `/cs`, deep links, API endpoints and sitemap/robots paths retain their explicit meaning. Direct English homepage links are inherently the same `/` entry point; visitors can select English to retain it. Search crawlers and prefetch requests bypass negotiation. Redirects use temporary 307 and private/no-store headers; canonical/hreflang/sitemap URLs are unchanged. Query parameters are preserved.

Run `node scripts/check-language-redirect.cjs` for focused routing checks. Also verify against an isolated production server with injected country headers and browser cookie tests. Host-country accuracy and header availability require a deployed check; VPNs may indicate a different country. Language options always remain visible.

Verification (10 November 2026): isolated production build passed; 26 focused routing cases passed; production browser checks passed for country redirects, fallback, cookie persistence, manual English override, explicit deep links, selecting the current language, query/hash and mobile picker. Three-language SEO checks passed (54 pages, 48 sitemap URLs, six legal noindex pages). Real hosting geolocation is not verified locally; Vercel/Cloudflare headers were simulated. No deployment performed.
