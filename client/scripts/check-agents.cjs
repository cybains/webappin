const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const ts = require('typescript');
const { NextRequest } = require('next/server');
function load(file, imports = {}, globals = {}) {
  const module = { exports: {} };
  vm.runInNewContext(ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, resolveJsonModule: true } }).outputText,
    { module, exports: module.exports, require: name => imports[name] || require(name), URL, Headers, AbortSignal, process, ...globals }, { filename: file });
  return module.exports;
}
const negotiation = load('src/lib/agent-negotiation.ts');
const markdown = load('src/lib/agent-markdown.ts');
const preference = load('src/lib/i18n/preference.ts');
const { middleware } = load('src/middleware.ts', { '@/lib/agent-negotiation': negotiation, '@/lib/i18n/preference': preference });
let checks = 0;
const vectors = [
  [null,'text/html'], ['*/*','text/html'], ['text/*','text/html'], ['',undefined],
  ['text/markdown','text/markdown'], ['text/html','text/html'], ['application/pdf',undefined],
  ['text/markdown;q=0, text/html','text/html'], ['text/markdown;q=0',undefined],
  ['text/html;q=0, */*;q=0.8','text/markdown'], ['text/markdown;q=0, */*;q=0.8','text/html'],
  ['text/markdown;q=0.8, text/html;q=0.9','text/html'], ['text/markdown, text/html;q=0.8','text/markdown'],
  ['TEXT/MARKDOWN;Q=1','text/markdown'], ['text/html;q=0,text/markdown;q=0',undefined],
  ['text/markdown;q=2,text/html;q=0.5','text/html'], ['text/markdown; charset=utf-8','text/markdown'],
  ['text/markdown; charset=iso-8859-1',undefined], ['text/markdown; variant="a,b"',undefined],
  ['text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,*/*;q=0.8','text/html'],
  ['text/*;q=0.9,text/html;q=0.1','text/markdown'], ['text/markdown;q=0.1234,text/html;q=0.5','text/html'],
];
for (const [header, expected] of vectors) { assert.equal(negotiation.representation(header), expected, header); checks++; }
assert.equal(negotiation.appendVary('RSC, Accept', 'accept'), 'RSC, Accept'); checks++;
const fixture = '<html><nav>Navigation noise</nav><main><h1>Hire &amp; prepare</h1><p>Visible <strong>screening</strong> and <em>support</em>.</p><ul><li>First check</li><li>Second check</li></ul><ol><li>Agree work</li><li>Decide</li></ol><details><summary>Requirements</summary><p>Qualifications depend on the job.</p></details><a href="/employers#enquiry">Discuss your role</a><a href="javascript:bad()">Unsafe link</a><form><input value="private-value"/>Form noise</form><script>alert(1)</script><svg><text>Map noise</text></svg><div hidden>Hidden noise</div></main></html>';
const converted = markdown.pageMarkdown(fixture,'https://sufoniq.com/');
for (const value of ['# Hire & prepare','**screening**','*support*','- First check','2. Decide','Qualifications depend','https://sufoniq.com/employers#enquiry','support@sufoniq.com']) { assert(converted.includes(value), value); checks++; }
for (const value of ['Navigation noise','private-value','Form noise','alert(1)','Map noise','Hidden noise','javascript:']) { assert(!converted.includes(value), value); checks++; }
assert.throws(() => markdown.pageMarkdown('<main></main>','https://sufoniq.com/')); checks++;
assert.throws(() => markdown.pageMarkdown('<p>No page</p>','https://sufoniq.com/')); checks++;
assert(markdown.pageMarkdown('<div data-page-content><h1>Insights</h1><p>Research and editorial content without a main element.</p></div>','https://sufoniq.com/insights').includes('# Insights')); checks++;
for (const path of ['/','/de','/cs/employers','/pl/truck-driver-recruitment','/ro/about','/__missing']) {
  const response = middleware(new NextRequest('https://sufoniq.com'+path+'?ignored=1', { headers: {accept:'text/markdown','x-vercel-ip-country':'DE'} }));
  const target = new URL(response.headers.get('x-middleware-rewrite'));
  assert.equal(target.pathname,'/api/agent-markdown');
  assert.equal(target.searchParams.get('path'),path);
  assert.equal(target.searchParams.has('ignored'),false);
  assert.equal(response.headers.get('vary'),'Accept');
  assert.equal(response.headers.get('x-middleware-request-x-sufoniq-markdown-path'),path);
  assert.equal(response.headers.get('location'),null);
  checks++;
}
for(const [path,headers,method] of [['/api/contact',{accept:'text/markdown'},'POST'],['/_next/test.js',{accept:'text/markdown'},'GET'],['/logo.svg',{accept:'text/markdown'},'GET'],['/employers',{accept:'text/x-component',rsc:'1'},'GET'],['/employers',{accept:'text/x-component'},'GET']]) {
  assert.equal(middleware(new NextRequest('https://sufoniq.com'+path,{headers,method})).headers.get('x-middleware-rewrite'),null); checks++;
}
assert.equal(middleware(new NextRequest('https://sufoniq.com/',{headers:{accept:'application/pdf'}})).status,406); checks++;

async function main() {
  let fetched;
  let source = async () => new Response(fixture,{headers:{'content-type':'text/html'}});
  const route = load('src/app/api/agent-markdown/route.ts', {
    '@/generated/sitemap.json':JSON.parse(fs.readFileSync('src/generated/sitemap.json','utf8')),
    '@/lib/agent-markdown':markdown,'@/lib/seo':{SITE_URL:'https://sufoniq.com'},
  }, {fetch:async (url,options)=>{fetched={url,options};return source();}});
  const request = (path,origin='https://sufoniq.com') => new NextRequest(origin+'/api/agent-markdown?path='+encodeURIComponent(path));
  let response = await route.GET(request('/de/employers'));
  assert.equal(response.status,200);assert.equal(response.headers.get('content-language'),'de');
  assert.equal(new URL(fetched.url).pathname,'/de/employers');assert.equal(fetched.options.headers.Accept,'text/html');
  assert.equal(fetched.options.headers.Cookie,undefined);assert.equal(fetched.options.redirect,'manual');checks+=6;
  response = await route.GET(request('/privacy-policy'));assert.equal(response.headers.get('x-robots-tag'),'noindex, follow');checks++;
  fetched=undefined;response=await route.GET(request('/__missing'));
  assert.equal(response.status,404);assert.equal(fetched,undefined);assert((await response.text()).includes('sitemap'));checks+=3;
  response=await route.GET(request('//attacker.example'));assert.equal(response.status,404);checks++;
  response=await route.GET(request('/','https://attacker.example'));assert.equal(response.status,503);checks++;
  source=async()=>new Response('Denied',{status:401});assert.equal((await route.GET(request('/'))).status,503);checks++;
  source=async()=>new Response('Missing',{status:404});assert.equal((await route.GET(request('/'))).status,404);checks++;
  source=async()=>{throw new Error('Timeout');};assert.equal((await route.GET(request('/'))).status,503);checks++;
  source=async()=>new Response(fixture,{headers:{'content-type':'text/html'}});
  response=await route.HEAD(request('/'));assert.equal(response.status,200);assert.equal(await response.text(),'');checks+=2;
  const llms=fs.readFileSync('public/llms.txt','utf8');assert(llms.startsWith('# Sufoniq\n')||llms.startsWith('# Sufoniq\r\n'));
  assert(llms.includes('When to use this:'));assert(llms.includes('Accept: text/markdown'));checks+=3;
  const identity=load('src/lib/structured-data.ts',{'./seo':{SITE_URL:'https://sufoniq.com'}}).siteIdentitySchema['@graph'][0];
  assert.equal(identity.address['@type'],'PostalAddress');assert.equal(identity.contactPoint['@type'],'ContactPoint');assert.equal(identity.contactPoint.email,'support@sufoniq.com');assert(identity.contactPoint.contactType);assert.equal(identity.logo,'https://sufoniq.com/logo.svg');checks+=5;
  console.log(`AGENTS UNIT PASS: ${checks} checks (negotiation, conversion, rewrites, errors, source isolation, legal noindex, identity and guidance).`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
