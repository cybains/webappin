const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),ts=require('typescript');
function load(file,imports={}){const module={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,{module,exports:module.exports,require:name=>imports[name]||require(name)});return module.exports;}
const fields=load('src/lib/campaign-fields.ts'),shared=load('src/lib/i18n/shared.ts');
const model=load('src/lib/campaign-enquiry.ts',{'./campaign-fields':fields,'./i18n/shared':shared});
let checks=0;
for(const kind of ['seasonal','driver']){
 const minimal=kind==='seasonal'?{email:'owner@example.test',operation:'Apples',region:'Styria'}:{email:'owner@example.test',country:'Austria',transport:'C+E refrigerated freight'};
 assert.equal(model.validateCampaign(kind,minimal),null);checks++;
 for(const field of fields.campaignFields[kind].filter(field=>field.required)){
  assert(model.validateCampaign(kind,{...minimal,[field.key]:''}));checks++;
 }
 for(const headcount of ['0','-1','1.2','10000','abc']){assert(model.validateCampaign(kind,{...minimal,headcount}));checks++;}
 for(const headcount of ['','1','9999']){assert.equal(model.validateCampaign(kind,{...minimal,headcount}),null);checks++;}
 for(const locale of ['en','de','cs','pl','ro']){
  const message=model.campaignMessage(kind,{...minimal,headcount:'1',code95:'at_introduction',qualification:'yes',accommodation:'available',notes:'Discuss terms'},locale);
  const route=kind==='seasonal'?'/austria-seasonal-workers':'/truck-driver-recruitment';
  assert(message.includes('Source: https://sufoniq.com'+shared.localizedHref(route,locale)));assert(message.includes('Language: '+locale));
  assert(message.includes(kind==='seasonal'?'Accommodation is available':'Must already be held when candidates are introduced'));
  assert(message.includes(kind==='seasonal'?'Region or work location in Austria: Styria':'We could support training and qualification'));checks+=4;
 }
}
for(const locale of ['de','cs','pl','ro']){
 const dictionary=JSON.parse(fs.readFileSync(`src/lib/i18n/${locale}.json`,'utf8'));
 for(const invalid of ['Enter a valid business email.','Please complete the required fields.','Enter a whole number between 1 and 9999.']){assert(dictionary[invalid]&&dictionary[invalid]!==invalid);checks++;}
}
console.log(`CAMPAIGN MODEL PASS: ${checks} validation, optional-field, canonical-option and localized-source checks.`);
