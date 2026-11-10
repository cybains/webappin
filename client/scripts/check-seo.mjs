import assert from "node:assert/strict";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import ts from "typescript";

// Read-only verification of the actual HTTP output. Run against dev or an isolated production server.
const base = process.env.SEO_CHECK_BASE_URL || "http://localhost:3000";
const canonicalOrigin = "https://sufoniq.com";
const nonIndexed = new Set(["/privacy-policy", "/terms-conditions", "/de/privacy-policy", "/de/terms-conditions"]);
const redirects = new Map([["/hiring-in-practice", "/employers"], ["/core-services", "/work-in-europe"], ["/methodology", "/method-trust"], ["/countries", "/"], ["/case-studies", "/employers"], ["/use-cases", "/employers"], ["/growth-atlas", "/insights"], ["/maptest", "/"], ["/jobs", "/employers"]]);
const routes = new Set();
function walk(directory, parts = []) {
  if (["page.tsx", "page.ts", "page.jsx", "page.js"].some(file => existsSync(path.join(directory, file)))) routes.add("/" + parts.join("/"));
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (!entry.isDirectory() || /^[\[_@]/.test(entry.name) || entry.name === "api") continue;
    walk(path.join(directory, entry.name), entry.name.startsWith("(") ? parts : [...parts, entry.name]);
  }
}
walk("src/app");
const content = ts.createSourceFile("content.ts", readFileSync("src/lib/insights/content.ts", "utf8"), ts.ScriptTarget.Latest, true);
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(content) === "insightPages" && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
    for (const item of node.initializer.elements) {
      if (!ts.isObjectLiteralExpression(item)) continue;
      const slug = item.properties.find(p => ts.isPropertyAssignment(p) && p.name.getText(content) === "slug");
      if (slug && ts.isStringLiteral(slug.initializer)) routes.add("/insights/" + slug.initializer.text);
    }
  }
  ts.forEachChild(node, visit);
}
visit(content);
for (const route of redirects.keys()) routes.delete(route);
const decode = value => value.replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#x27;/g, "'");
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map(match => Object.fromEntries([...match[0].matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), decode(value)])));
const request = (route, options = {}) => fetch(new URL(route, base), { signal: AbortSignal.timeout(60000), headers: { "User-Agent": "Googlebot" }, redirect: "manual", ...options });
const titles = new Set(), descriptions = new Set(), documents = new Map(), assetPaths = new Set();
let fragmentCount = 0;
for (const route of [...routes].sort()) {
  const response = await request(route);
  assert.equal(response.status, 200, `${route}: HTTP status`);
  const html = await response.text();
  documents.set(route, html);
  const documentWithoutSvg = html.replace(/<svg\b[\s\S]*?<\/svg>/gi, "");
  const htmlTitles = [...documentWithoutSvg.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  assert.equal(htmlTitles.length, 1, `${route}: exactly one document title (SVG labels excluded)`);
  const title = decode(htmlTitles[0][1]);
  assert(title.trim() && !titles.has(title), `${route}: unique non-empty title`); titles.add(title);
  const meta = tags(html, "meta");
  const byName = name => meta.find(m => m.name === name)?.content;
  const byProperty = name => meta.find(m => m.property === name)?.content;
  const description = byName("description");
  assert(description?.trim() && !descriptions.has(description), `${route}: unique description`); descriptions.add(description);
  const canonical = tags(html, "link").find(link => link.rel === "canonical")?.href;
  assert.equal(canonical && new URL(canonical).href, new URL(route, canonicalOrigin).href, `${route}: self-canonical`);
  const languageBase=route === "/de" ? "/" : route.replace(/^\/de(?=\/)/, "");
  const germanEquivalent=languageBase === "/" ? "/de" : "/de"+languageBase;
  if(routes.has(germanEquivalent)) {
    for(const [lang,target] of [["en",languageBase],["de",germanEquivalent],["x-default",languageBase]]) {
      const alternate=tags(html,"link").find(link=>link.rel === "alternate" && link.hreflang === lang);
      assert.equal(alternate?.href && new URL(alternate.href).href,new URL(target,canonicalOrigin).href,`${route}: ${lang} alternate language URL`);
    }
    assert.equal(byProperty("og:locale"),route === "/de" || route.startsWith("/de/") ? "de_DE" : "en_GB",`${route}: social locale`);
  }
  assert.equal(byProperty("og:url"), canonical, `${route}: Open Graph URL agrees with canonical`);
  assert.equal(byProperty("og:title"), title, `${route}: social title`);
  assert.equal(byProperty("og:description"), description, `${route}: social description`);
  assert.equal(byName("twitter:card"), "summary_large_image", `${route}: social card`);
  assert(byName("viewport"), `${route}: viewport`);
  assert(tags(html, "html").some(tag => tag.lang === (route === "/de" || route.startsWith("/de/") ? "de" : "en")), `${route}: document language`);
  assert.equal([...html.matchAll(/<h1\b[^>]*>/gi)].length, 1, `${route}: single H1`);
  const noindex = /(?:^|,)\s*noindex(?:,|$)/.test(byName("robots") || "");
  assert.equal(noindex, nonIndexed.has(route), `${route}: intended indexability`);
  assert(!/(?:^|,)\s*nofollow(?:,|$)/.test(byName("robots") || ""), `${route}: links remain followable`);
  assert(!/noindex/i.test(response.headers.get("x-robots-tag") || "") || nonIndexed.has(route), `${route}: header does not block intended indexing`);
  const image = byProperty("og:image");
  assert(image && byProperty("og:image:alt"), `${route}: share image and alternative text`);
  assetPaths.add(new URL(image).pathname);
  for (const link of tags(html, "link").filter(link => /^(?:icon|apple-touch-icon)$/.test(link.rel))) assetPaths.add(new URL(link.href, base).pathname);
  const data = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].flatMap(match => { const item = JSON.parse(match[1]); return item["@graph"] || [item]; });
  assert(data.some(node => node["@type"] === "Organization" && node.legalName === "UAB Skillaxis"), `${route}: company identity`);
  assert(data.some(node => node["@type"] === "WebSite"), `${route}: website identity`);
  if (!nonIndexed.has(route)) {
    assert(data.some(node => ["WebPage", "AboutPage", "CollectionPage"].includes(node["@type"])), `${route}: page entity`);
    if (route !== "/" && route !== "/de") assert(data.some(node => node["@type"] === "BreadcrumbList"), `${route}: breadcrumbs`);
  }
  for (const breadcrumb of data.filter(node => node["@type"] === "BreadcrumbList")) {
    const items = breadcrumb.itemListElement;
    assert(items.length >= 2 && items.every((item, i) => item.position === i + 1 && item.name && new URL(item.item).origin === canonicalOrigin), `${route}: valid ordered breadcrumbs`);
    assert.equal(new URL(items.at(-1).item).href, new URL(canonical).href, `${route}: last breadcrumb identifies current page`);
  }
  if (route.startsWith("/insights/") || route.startsWith("/de/insights/")) {
    assert.equal(byProperty("og:type"), "article", `${route}: article Open Graph type`);
    const article = data.find(node => node["@type"] === "BlogPosting");
    assert(article?.headline && article.author?.name && article.publisher?.["@id"], `${route}: article headline, author and publisher`);
  }
  assert(!data.some(node => node["@type"] === "JobPosting"), `${route}: service pages do not invent job listings`);
  console.log(`PASS ${route} — ${title}`);
}
const sitemapResponse = await request("/sitemap.xml"); assert.equal(sitemapResponse.status, 200);
assert(/xml/.test(sitemapResponse.headers.get("content-type")), "XML sitemap content type");
const sitemap = await sitemapResponse.text();
const locations = [...sitemap.matchAll(/<loc>([^<]*)<\/loc>/g)].map(match => decode(match[1]));
assert.equal(new Set(locations).size, locations.length, "No duplicate sitemap URLs");
const expected = [...routes].filter(route => !nonIndexed.has(route)).map(route => new URL(route, canonicalOrigin).href).sort();
assert.deepEqual(locations.slice().sort(), expected, "Sitemap exactly covers current indexable routes");
for (const match of sitemap.matchAll(/<lastmod>([^<]*)<\/lastmod>/g)) assert(!Number.isNaN(Date.parse(match[1])) && Date.parse(match[1]) <= Date.now(), "Real, non-future sitemap dates");
const robotsResponse = await request("/robots.txt");assert.equal(robotsResponse.status, 200);
const robots = await robotsResponse.text();
assert(robots.includes("Allow: /") && robots.includes(`${canonicalOrigin}/sitemap.xml`), "Crawling and sitemap discovery allowed");
assert(!/Disallow:\s*\/(?:privacy-policy|terms-conditions)/.test(robots), "Legal pages crawlable for noindex discovery");
for (const [route, html] of documents) {
  for (const link of tags(html, "a")) {
    if (!link.href?.startsWith("/") && !link.href?.startsWith("#")) continue;
    const url = new URL(link.href, new URL(route, canonicalOrigin));
    if (url.origin !== canonicalOrigin) continue;
    if (url.hash && documents.has(url.pathname)) {
      fragmentCount++;
      assert(documents.get(url.pathname).includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${route}: fragment target ${link.href}`);
    }
    assert(!redirects.has(url.pathname), `${route}: internal link uses final destination ${link.href}`);
    assert(url.pathname !== "/ghana-tde", `${route}: no removed campaign links`);
  }
}
for (const asset of assetPaths) assert.equal((await request(asset)).status, 200, `Public metadata asset ${asset}`);
for (const [route, target] of redirects) {
  const response = await request(route);
  assert([301, 308].includes(response.status), `${route}: permanent redirect`);
  assert.equal(new URL(response.headers.get("location"), base).pathname, target, `${route}: correct redirect target`);
}
const unknownGerman = await request("/de/not-a-real-page");assert.equal(unknownGerman.status,404,"Unknown German routes are not invented");
const missing = await request("/ghana-tde");assert.equal(missing.status, 404, "Removed Ghana page stays 404");
const unknown = await request("/insights/not-a-real-article");assert.equal(unknown.status, 404, "Unknown article stays 404");
console.log(`SEO PASS: ${routes.size} pages, ${locations.length} sitemap URLs, ${nonIndexed.size} intentional noindex pages, ${fragmentCount} fragment links, ${assetPaths.size} metadata assets and ${redirects.size} redirects.`);
