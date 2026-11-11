# Agent readable public pages

The HTML website remains the interactive product. Public page URLs also serve Markdown when it is the preferred acceptable representation. This improves machine access; it is not a guarantee of AI referrals or search rankings.

## Public behaviour

- `Accept: text/markdown` selects Markdown at the same URL, including `/` and explicit translated URLs. It does not trigger IP or cookie language selection.
- `Accept: text/html`, absent Accept and `*/*` retain HTML. Existing HTML homepage language selection still applies.
- Quality values, specificity and exclusions select between UTF-8 HTML and Markdown. Unsupported-only requests receive HTTP 406 with the supported types listed.
- Both variants include `Vary: Accept`. Markdown and negotiation errors are not stored in browser or Vercel CDN caches. Normal Next RSC navigation, APIs and static assets bypass this page negotiation.
- Missing extensionless page URLs return HTTP 404 with Markdown, an explanation and links to `/llms.txt` and `/sitemap.xml` when Markdown is requested. HTML 404 behaviour is retained.
- The 80 indexable pages and ten legal pages use the rendered HTML as their content source. The legal Markdown variants retain `noindex, follow`.
- Scripts, SVG maps, navigation, forms, hidden content and form values are excluded from conversion. Visible headings, body copy, lists, links and disclosure answers remain. Source and contact links are appended.
- `/llms.txt` follows the published H1, summary, explanatory prose and H2 link-list structure. It explains use cases, languages, contact and the absence of an agent transaction API.
- Shared Organization JSON-LD includes the existing public postal address, existing logo and a customer-enquiry email contact point. No personal social profile is represented as the company's identity.

## Implementation boundaries

`src/middleware.ts` negotiates the response and rewrites Markdown requests to `/api/agent-markdown`. The handler accepts only public paths from the generated sitemap plus the legal pages. It reads HTML from the same deployment with explicit HTML Accept and a dedicated reader user agent, bypassing the homepage geo redirect. No caller cookies, credentials or query values are forwarded, and redirects are not followed. It never submits forms or invokes business APIs.

The handler allows the canonical hostname, Vercel deployment hostnames, and loopback development/verification when not running on Vercel. If the HTML source is blocked, malformed, lacks readable main content or times out, it returns 503 rather than an invented successful page. A protected Vercel preview may therefore return 503 until the preview is accessible. No protection bypass credential is added or required for the public production site.

HTML conversion adds an internal HTML read per Markdown request. The parser is the already installed `htmlparser2` version 8.0.2, promoted to a direct, lockfile-pinned dependency. Changing the canonical domain or adding a new hosting domain requires updating the source-origin allowlist. Public pages added later enter the Markdown allowlist when the sitemap generator includes them; new non-indexed pages need an explicit entry.

## Repeatable verification

Run `npm run check:agents` for negotiation, conversion, rewrite, source isolation, failure and schema tests, plus the existing language regression suite.

Run `npm run check:agents:http` against the running site. Set `AGENT_CHECK_BASE_URL` to test a different local server or the deployed origin. It checks every public page in HTML and Markdown, 404s, HEAD, unsupported formats, language isolation, RSC, guidance links, sitemap, robots and logo. Run `npm run check:seo` with `SEO_CHECK_BASE_URL` as appropriate to retain the broader canonical, social, hreflang, JSON-LD and redirect checks. These are read-only tests; no enquiries are sent.

After deployment, repeat both HTTP suites against `https://sufoniq.com` to verify Vercel's final response headers and caching behaviour, then rerun the external audit. A local pass cannot establish an external readiness score.

Manual checks:

```sh
curl -sS -L -i -H 'Accept: text/markdown' https://sufoniq.com/
curl -sS -L -i -H 'Accept: text/html' https://sufoniq.com/
curl -sS -L -i -H 'Accept: text/markdown' https://sufoniq.com/__missing-agent-page
curl -sS -i -H 'Accept: application/pdf' https://sufoniq.com/
```

## Protocol references

Verification completed locally on 11 November 2026: final production build passed with 93 static outputs; 78 agent unit checks and 36 language checks passed; all 90 public pages passed HTML and Markdown HTTP verification against the isolated production build. The HTTP suite also passed six missing-page cases, format preferences, HEAD, cookie/language isolation, React navigation, guidance links, sitemap, robots and logo checks. The broader SEO suite passed 90 pages, 80 sitemap URLs, ten intentional noindex pages, 555 fragments, three metadata assets and nine redirects. Deployment and external rescanning remain separate steps.

- [Accept Markdown guidance](https://acceptmarkdown.com/guides): response negotiation, q-values, Vary and 406.
- [HTTP semantics](https://www.rfc-editor.org/rfc/rfc9110.html#section-12.5.1): Accept media ranges and preference precedence.
- [llms.txt proposal](https://llmstxt.org/): format and use-case guidance.
- [Vercel cache-control documentation](https://vercel.com/docs/caching/cache-control-headers): explicit no-store for variant safety.
