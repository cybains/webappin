# Website localisation

English keeps its original public URLs. The German core site includes the homepage, employer services, driver recruitment, Austrian seasonal staffing, About, Method & Trust, job-seeker support, Privacy, Terms and the Insights index. All eight Insights articles are translated, including the visual growth essay and its chart labels, captions and accessibility text.

## Structure

- src/app/(english): existing English routes. The route group changes source organisation, not public URLs.
- src/app/de: thin German route wrappers with German metadata and structured data.
- src/components/SiteShell.tsx: shared root layout; sets the HTML language on the server. Separate root layouts keep pages statically renderable without cookie/header detection.
- src/lib/i18n/de.json: German messages keyed by their complete English source text (gettext-style). Change a source sentence and update its German entry together.
- src/lib/i18n/server.ts: server translations. English client components receive an empty message dictionary; German receives German messages through LocaleProvider.
- src/lib/i18n/shared.ts: locale types, supported German routes and internal link mapping.
- src/lib/i18n/pages.ts: German core-page titles and search descriptions.
- src/components/InsightArticle.tsx and src/lib/i18n/insights.ts: shared article rendering and translated fields; URLs, identifiers and block types are preserved.

The build checks literal UI messages, configured UI data and every visible text field in the translated articles. Updating English source copy without its German entry fails this check. The German Insights carousel uses the sourced GDP chart; illustrative charts on the English index are not republished as German evidence.

Components, styles, forms and the map are shared. Do not copy the English markup into separate German designs. German employer copy uses formal Sie, natural German business language and no additional service promises.

## Terminology

Screening = Vorauswahl anhand vereinbarter Anforderungen; never imply independent certification. Sourcing = Suche/Ansprache passender Bewerber. Work permission in Austrian seasonal copy = Beschäftigungsbewilligung. Qualification recognition = Anerkennung. Availability = Verfügbarkeit, distinct from legal permission to start. Mobility coordination = Vorbereitung/Koordination der Schritte bis zum Arbeitsbeginn, rather than promising relocation services. Keep company names and official identifiers unchanged.

## Adding a translation

1. Translate the complete page and enquiry journey in de.json; use t() in shared renderers and localize links through LocalizedLink.
2. Add the route to germanPaths and German metadata to germanPages.
3. Add a thin German route wrapper with GermanPageSchema and the shared content component.
4. Verify reciprocal hreflang, self-canonicals, HTML lang, structured data and sitemap inclusion with npm run check:seo.
5. The production build runs the translation coverage check automatically. Run npm run check:locales and check actual German rendering at 320, 390, 768 and desktop widths. Test forms using intercepted API responses, never real test enquiries.

The German navigation links to the translated core pages. Every Insights article has a paired German URL. Unsupported future routes retain English URLs and are marked (Englisch) until translated. The language switcher changes equivalent pages, with no automatic language redirect. German Privacy and Terms preserve the English text and remain noindex, follow; they are excluded from the sitemap. Independent language/legal review has not been completed. Decorative map labels and underlying data/animation remain unchanged.

The writing-lab editorial record is a single-author translation review, not independent native-speaker certification. No deployment is performed by this change.

The growth essay explicitly labels its four illustrative charts as example data in both languages. The sourced GDP chart retains its data and source attribution.

## Language picker

The header uses LanguageSwitcher.tsx as a right-aligned disclosure with native language names and the active locale marked. languageOptions in shared.ts defines the displayed choices; adding a locale also requires its routing, messages, metadata and actual translated pages. Do not add a selectable language before its equivalent route is available. The picker preserves the current query/hash, supports keyboard opening and Escape/focus return, and closes on outside click or focus leaving the control. No extra dropdown dependency is required.
