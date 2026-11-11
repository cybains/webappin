# Employer campaign enquiry pages

The Austrian page now invites discussion of 2027 seasonal staffing. Its form captures the crop or agricultural operation, Austrian region, headcount, intended dates and accommodation. The driver page invites a feasibility discussion for one C+E vacancy, with country, transport type, headcount, timing, languages, Code 95 expectations and qualification support collected separately.

Each form requires only a business email and two campaign-defining fields. Other details can remain open for discussion. The company field is optional. Unknown qualification or accommodation arrangements do not imply that Sufoniq will provide them.

Beside each form, the page distinguishes screening from permission and qualification checks and the employer's selection/direct employment decision. UAB Skillaxis, company code 307395574, is identified as the contracting company. A written proposal sets out work, deliverables, responsibilities and fees before paid work is agreed. The feasibility CTA opens an enquiry, not an automated authorization assessment or a placement reservation.

## Links for campaign emails

Use the explicit language URL in each email. These ten routes, their language-picker equivalents, form privacy links and confirmation languages were tested locally. Deploy the revision and verify the live destinations before sending the campaign.

| Language | Austrian seasonal staffing | Truck-driver recruitment |
|---|---|---|
| English | https://sufoniq.com/austria-seasonal-workers | https://sufoniq.com/truck-driver-recruitment |
| German | https://sufoniq.com/de/austria-seasonal-workers | https://sufoniq.com/de/truck-driver-recruitment |
| Czech | https://sufoniq.com/cs/austria-seasonal-workers | https://sufoniq.com/cs/truck-driver-recruitment |
| Polish | https://sufoniq.com/pl/austria-seasonal-workers | https://sufoniq.com/pl/truck-driver-recruitment |
| Romanian | https://sufoniq.com/ro/austria-seasonal-workers | https://sufoniq.com/ro/truck-driver-recruitment |

## Verification

- `npm run check:campaigns` checks required/optional fields, numeric validation, independent qualification choices and localized source URLs.
- `npm run check:campaigns:browser` checks ten form journeys, twenty layouts at 1440px and 360px, field alignment, required-field validation, retained values after failures, rejection of HTTP 200 with `ok:false`, localized success messages, complete payloads, privacy links, language selection and saved preference cookies.
- Browser requests to `/api/contact` are intercepted. Thirty requests are exercised without sending real email. On-screen confirmations are verified; inbox delivery and automatic customer emails are not established by these tests. The existing endpoint sends the enquiry to the business; this revision does not add an automatic customer-email service.
- Set `CAMPAIGN_CHECK_BASE_URL` for another server. The browser script uses installed Playwright, with `PLAYWRIGHT_MODULE` available to select an existing installation. In this workspace it can use the adjacent inquos3 installation. Screenshots/results are under the ignored `.next-verify-campaign-artifacts` directory.

The existing Writing Lab projects `sufoniq-austria-seasonal-page` and `sufoniq-truck-driver-recruitment` hold the campaign briefs, full-copy artifacts, localized additions, adversarial editorial reviews, Q1 records and revision notes. Reviews are AI author-operated, with no independent native-speaker or buyer certification and no asserted conversion-rate improvement.

Before reusing the campaign for another year, update the 2027 seasonal wording and examples. No pricing amount, placement result, visa outcome, training capacity or available candidate stock was added.

Final local production verification on 11 November 2026: build passed (93 static outputs); campaign model passed 76 checks; all ten localized browser journeys and twenty layouts passed on the production build with thirty intercepted requests. The full SEO suite passed 90 pages, 80 sitemap URLs, ten noindex pages, 555 fragments and nine redirects. The agent HTTP suite passed all 90 HTML/Markdown page pairs and its machine-readable endpoint checks. Lint and locale checks passed. The temporary verification server was stopped; the user development server was left running. No commit, deployment or live email was performed.
