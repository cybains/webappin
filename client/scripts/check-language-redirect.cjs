// Exercise real Next request/response objects without starting a server.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { NextRequest } = require('next/server');
function load(file, imports = {}) {
  const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const module = { exports: {} };
  vm.runInNewContext(source, { module, exports: module.exports, require: name => imports[name] || require(name) }, { filename: file });
  return module.exports;
}
const preference = load('src/lib/i18n/preference.ts');
const { middleware } = load('src/middleware.ts', { '@/lib/i18n/preference': preference });
let checks = 0;
function check(path, headers, destination, language, method = 'GET') {
  const response = middleware(new NextRequest(`https://sufoniq.com${path}`, { headers, method }));
  assert.equal(response.headers.get('location'), destination ? `https://sufoniq.com${destination}` : null);
  assert.equal(response.cookies.get(preference.LANGUAGE_COOKIE)?.value, language);
  if (language) {
    assert.equal(response.cookies.get(preference.LANGUAGE_COOKIE).secure, true);
    assert.equal(response.cookies.get(preference.LANGUAGE_COOKIE).sameSite, 'lax');
    assert.equal(response.cookies.get(preference.LANGUAGE_COOKIE).maxAge, 31536000);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
  }
  if (destination) {
    assert.equal(response.status, 307);
    assert.equal(response.headers.get('cache-control'), 'private, no-store');
  }
  checks++;
}
for (const [country, locale] of [['CZ','cs'], ['DE','de'], ['AT','de'], ['US','en'], ['CH','en'], ['XX','en']]) {
  check('/?campaign=email', { 'x-vercel-ip-country': country }, locale === 'en' ? null : `/${locale}?campaign=email`, locale);
}
check('/', {}, null, 'en');
check('/', { 'cf-ipcountry': 'CZ' }, '/cs', 'cs');
for (const locale of ['en','de','cs']) {
  check('/', { 'x-vercel-ip-country': 'CZ', cookie: `sufoniq-language=${locale}` }, locale === 'en' ? null : `/${locale}`, undefined);
}
check('/', { 'x-vercel-ip-country': 'DE', cookie: 'sufoniq-language=invalid' }, '/de', 'de');
for (const path of ['/de','/cs','/employers','/cs/employers','/de/employers','/api/contact','/sitemap.xml','/robots.txt']) {
  check(path, { 'x-vercel-ip-country': 'CZ' }, null, undefined);
}
for (const bot of ['Googlebot/2.1', 'bingbot/2.0']) check('/', { 'x-vercel-ip-country': 'CZ', 'user-agent': bot }, null, undefined);
check('/', { 'x-vercel-ip-country': 'CZ', 'next-router-prefetch': '1' }, null, undefined);
check('/', { 'x-vercel-ip-country': 'CZ', purpose: 'prefetch' }, null, undefined);
check('/', { 'x-vercel-ip-country': 'CZ' }, null, undefined, 'POST');
check('/', { 'x-vercel-ip-country': 'AT' }, '/de', 'de', 'HEAD');
console.log(`LANGUAGE REDIRECT PASS: ${checks} cases (countries, preference, deep links, crawlers, prefetch, methods, query preservation).`);
