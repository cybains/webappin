import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const base = process.env.AGENT_CHECK_BASE_URL || 'http://localhost:3000';
const sitemap = JSON.parse(readFileSync('src/generated/sitemap.json','utf8'));
const legal = ['', '/de', '/cs', '/pl', '/ro'].flatMap(prefix=>[prefix+'/privacy-policy',prefix+'/terms-conditions']);
const paths = [...new Set([...sitemap.map(page=>page.path),...legal])];
const request = (path,accept,extra={}) => fetch(new URL(path,base),{headers:{Accept:accept,'User-Agent':'Sufoniq-Agent-Verification',...extra},redirect:'manual',signal:AbortSignal.timeout(60000)});
const hasAccept = response => assert(response.headers.get('vary')?.split(',').some(value=>value.trim().toLowerCase()==='accept'),'Vary: Accept');
let checked=0;
// Bounded concurrency keeps runtime conversion plus its HTML fetch inexpensive locally.
async function verify(path) {
  const md=await request(path,'text/markdown');
  assert.equal(md.status,200,path+' Markdown status');
  assert.match(md.headers.get('content-type'),/^text\/markdown\b/);hasAccept(md);
  assert.match(md.headers.get('cache-control'),/no-store/);
  const text=await md.text();
  assert(text.length>100,path+' meaningful body');
  assert(!/<(?:html|script|svg|form)\b/i.test(text),path+' no HTML shell or executable code');
  assert(text.includes('https://sufoniq.com'+(path==='/'?'/':path)),path+' canonical source');
  assert(text.includes('support@sufoniq.com'),path+' contact');
  assert.equal(md.headers.get('content-language'),/^\/(de|cs|pl|ro)(?:\/|$)/.exec(path)?.[1]??'en');
  if(legal.includes(path))assert.equal(md.headers.get('x-robots-tag'),'noindex, follow');
  const html=await request(path,'text/html');assert.equal(html.status,200,path+' HTML status');
  assert.match(html.headers.get('content-type'),/^text\/html\b/);hasAccept(html);
  const source=await html.text();assert(/<h1\b/.test(source),path+' original heading');
  // Visible first heading must survive conversion, not be replaced with a generic summary.
  const heading=source.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]*>/g,'').replace(/&amp;/g,'&').replace(/&#x27;/g,"'");
  const normal=value=>value.replace(/\\([\W])/g,'$1').replace(/\s+/g,' ').trim();
  assert(normal(text).replace(/\s/g,'').includes(normal(heading).replace(/\s/g,'')),path+' first heading preserved');
  const graphs=[...source.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(match=>JSON.parse(match[1]));
  const entities=graphs.flatMap(graph=>graph['@graph']??[graph]);
  assert(entities.some(entity=>entity['@type']==='Organization'&&entity.contactPoint?.email==='support@sufoniq.com'&&entity.address?.['@type']==='PostalAddress'&&entity.logo),path+' complete identity');
  checked++;console.log('AGENT HTTP PASS '+path);
}
for(let i=0;i<paths.length;i+=2)await Promise.all(paths.slice(i,i+2).map(verify));
for(const path of ['/__ora-missing-page','/de/__ora-missing-page','/cs/__ora-missing-page','/pl/__ora-missing-page','/ro/__ora-missing-page','/ghana-tde']){
  const response=await request(path,'text/markdown');assert.equal(response.status,404);hasAccept(response);
  assert.match(response.headers.get('content-type'),/^text\/markdown/);const body=await response.text();assert(body.length>=20&&body.includes('https://sufoniq.com/llms.txt'));
  assert.equal((await request(path,'text/html')).status,404);
}
for(const [accept,status,type] of [['text/markdown;q=0, text/html',200,'text/html'],['text/markdown;q=0.9,text/html;q=0.5',200,'text/markdown'],['text/html;q=0,*/*;q=0.5',200,'text/markdown'],['application/pdf',406,'text/plain'],['*/*',200,'text/html']]){
  const response=await request('/',accept);assert.equal(response.status,status);assert(response.headers.get('content-type').startsWith(type));hasAccept(response);await response.text();
}
const head=await fetch(new URL('/',base),{method:'HEAD',headers:{Accept:'text/markdown'}});assert.equal(head.status,200);assert.equal(await head.text(),'');hasAccept(head);
const cookie=await request('/','text/markdown',{cookie:'sufoniq-language=de','x-vercel-ip-country':'DE'});assert.equal(cookie.status,200);assert.equal(cookie.headers.get('content-language'),'en');assert.equal(cookie.headers.get('set-cookie'),null);await cookie.text();
const rsc=await request('/employers','text/x-component',{RSC:'1'});assert.equal(rsc.status,200);assert.match(rsc.headers.get('content-type'),/^text\/x-component/);await rsc.text();
const xml=await request('/sitemap.xml','application/xml');assert.equal(xml.status,200);assert((await xml.text()).includes('<urlset'));
const robots=await request('/robots.txt','text/plain');assert.equal(robots.status,200);assert((await robots.text()).includes('Sitemap: https://sufoniq.com/sitemap.xml'));
const llms=await request('/llms.txt','text/plain');assert.equal(llms.status,200);const guidance=await llms.text();assert(guidance.startsWith('# Sufoniq'));assert(guidance.includes('When to use this:'));assert(guidance.includes('How to use this:'));
for(const [,link] of guidance.matchAll(/\[[^\]]+\]\((https:\/\/sufoniq\.com[^)]+)\)/g)){
  const url=new URL(link);const response=await request(url.pathname,url.pathname.endsWith('.xml')?'application/xml':'text/html');assert.equal(response.status,200,'llms link '+link);await response.text();
}
const logo=await request('/logo.svg','image/svg+xml');assert.equal(logo.status,200);await logo.text();
const direct=await request('/api/agent-markdown?path=%2F__missing','text/markdown');assert.equal(direct.status,404);await direct.text();
console.log(`AGENTS HTTP PASS: ${checked} public pages in HTML and Markdown, six real 404s, negotiation preferences, HEAD, language isolation, RSC, llms links, sitemap, robots and logo.`);
