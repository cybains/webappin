const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
let playwright;
try { playwright = require('playwright'); } catch { playwright = require(process.env.PLAYWRIGHT_MODULE || path.resolve('../../inquos3/node_modules/playwright')); }
const base = process.env.CAMPAIGN_CHECK_BASE_URL || 'http://localhost:3000';
const output = path.resolve('.next-verify-campaign-artifacts');fs.mkdirSync(output,{recursive:true});
const locales=['en','de','cs','pl','ro'];
const dictionaries=Object.fromEntries(locales.map(locale=>[locale,locale==='en'?{}:JSON.parse(fs.readFileSync(`src/lib/i18n/${locale}.json`,'utf8'))]));
const translate=(locale,text)=>dictionaries[locale][text]||text;
const expectedPath=(locale,kind)=>(locale==='en'?'':'/'+locale)+(kind==='seasonal'?'/austria-seasonal-workers':'/truck-driver-recruitment');
async function main(){
 const browser=await playwright.chromium.launch({headless:true});let journeys=0,layouts=0;
 try{
  for(const locale of locales)for(const kind of ['seasonal','driver']){
   const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();
   let mode='error',calls=[];const pageErrors=[];page.on('pageerror',e=>pageErrors.push(e.message));
   await page.route('**/api/contact',async route=>{calls.push(route.request().postDataJSON());await route.fulfill({status:mode==='error'?502:200,contentType:'application/json',body:JSON.stringify(mode==='success'?{ok:true,id:'intercepted-test'}:{ok:false})});});
   const response=await page.goto(base+expectedPath(locale,kind),{waitUntil:'networkidle',timeout:90000});assert.equal(response.status(),200);
   assert.equal(await page.locator('html').getAttribute('lang'),locale);
   const form=page.locator('form').filter({has:page.locator('input[name="company"]')});assert.equal(await form.count(),1);
   assert.equal(await form.locator('[required]').count(),3);
   assert((await page.locator('main').innerText()).includes('307395574'));
   const cta=translate(locale,kind==='seasonal'?'Discuss your 2027 staffing requirement':'Check feasibility for one C+E vacancy');
   assert(await page.locator('header a').filter({hasText:cta}).count());
   for(const width of [1440,360]){
    await page.setViewportSize({width,height:1000});await page.evaluate(()=>document.fonts.ready);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${locale} ${kind} ${width}: page overflow`);
    const controls=await form.locator('input,select,textarea,button').evaluateAll(nodes=>nodes.map(n=>{const r=n.getBoundingClientRect();return{left:r.left,right:r.right,width:r.width}}));
    assert(controls.every(r=>r.left>=-1&&r.right<=width+1&&r.width>0),`${locale} ${kind} ${width}: controls fit`);
    if(width===1440){const email=await form.locator('[name="email"]').boundingBox(),company=await form.locator('[name="company"]').boundingBox();assert(Math.abs(email.y-company.y)<=1,'paired fields align despite translated label wrapping');}
    if(locale==='de'||locale==='ro'&&width===360)await form.screenshot({path:path.join(output,`${locale}-${kind}-${width}.png`),style:'header:has(nav), nextjs-portal { visibility: hidden !important; }'});
    layouts++;
   }
   await form.locator('button[type="submit"]').click();assert.equal(calls.length,0,'empty form not submitted');
   await form.locator('[name="email"]').fill('campaign-check@example.test');await form.locator('[name="company"]').fill('Campaign test company');
   if(kind==='seasonal'){
    await form.locator('[name="operation"]').fill('Apple harvest');await form.locator('[name="region"]').fill('Styria');
    await form.locator('[name="headcount"]').fill('8');await form.locator('[name="timing"]').fill('June–September 2027');await form.locator('[name="accommodation"]').selectOption('available');
   }else{
    await form.locator('[name="country"]').fill('Austria');await form.locator('[name="transport"]').fill('C+E refrigerated freight');
    await form.locator('[name="headcount"]').fill('1');await form.locator('[name="timing"]').fill('March 2027');await form.locator('[name="languages"]').fill('German A2');
    await form.locator('[name="code95"]').selectOption('at_start');await form.locator('[name="qualification"]').selectOption('yes');
   }
   await form.locator('[name="notes"]').fill('Discuss scope and a written proposal.');
   await form.locator('button[type="submit"]').click();await form.getByRole('alert').waitFor();
   assert.equal(await form.locator('[name="email"]').inputValue(),'campaign-check@example.test','failed enquiry retained');
   if(locale!=='en')assert(!(await form.getByRole('alert').innerText()).startsWith('We couldn’t'));
   mode='false-success';await form.locator('button[type="submit"]').click();await page.waitForFunction(()=>!document.querySelector('form[aria-busy="true"]'));
   assert.equal(await form.getByRole('status').count(),0,'200 ok:false cannot claim success');
   mode='success';await form.locator('button[type="submit"]').click();await form.getByRole('status').waitFor();
   const confirmation=await form.getByRole('status').innerText();assert(confirmation.includes('UAB Skillaxis'));if(locale!=='en')assert(!confirmation.startsWith('Enquiry received'));
   assert.equal(await form.locator('[name="email"]').inputValue(),'');assert.equal(calls.length,3);
   const submitted=calls.at(-1);assert(submitted.message.includes(`Language: ${locale}`));assert(submitted.message.includes('Source: https://sufoniq.com'+expectedPath(locale,kind)));
   for(const value of kind==='seasonal'?['Apple harvest','Styria','Workers needed: 8','June–September 2027','Accommodation is available']:['Austria','C+E refrigerated freight','Number of drivers: 1','German A2','Required before a professional driving start','We could support training and qualification'])assert(submitted.message.includes(value),value+' included');
   assert((await form.locator('a[href*="privacy-policy"]').getAttribute('href')).startsWith(locale==='en'?'/privacy-policy':'/'+locale+'/privacy-policy'));
   await page.getByRole('button',{name:new RegExp(translate(locale,'Choose language'))}).click();
   const picker=page.getByRole('navigation',{name:translate(locale,'Switch language'),exact:true});
   for(const other of locales)assert.equal(await picker.locator(`a[hreflang="${other}"]`).getAttribute('href'),expectedPath(other,kind));
   const destination=locale==='en'?'de':'en';await picker.locator(`a[hreflang="${destination}"]`).click();await page.waitForURL('**'+expectedPath(destination,kind));assert.equal(await page.locator('html').getAttribute('lang'),destination);
   assert((await context.cookies()).some(cookie=>cookie.name==='sufoniq-language'&&cookie.value===destination));
   assert.deepEqual(pageErrors,[],locale+' '+kind+' browser errors');journeys++;
   await context.close();console.log(`CAMPAIGN PASS ${locale} ${kind}`);
  }
  fs.writeFileSync(path.join(output,'results.json'),JSON.stringify({base,journeys,layouts,mockedRequests:journeys*3,realEmailsSent:0},null,2));
  console.log(`CAMPAIGN BROWSER PASS: ${journeys} localized journeys, ${layouts} desktop/mobile layouts, ${journeys*3} intercepted requests; no real emails sent.`);
 }finally{await browser.close();}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
