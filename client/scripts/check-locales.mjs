import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
import ts from 'typescript';
import vm from 'node:vm';

const dictionaries=Object.fromEntries(['de','cs','pl'].map(locale=>[locale,JSON.parse(readFileSync('src/lib/i18n/'+locale+'.json','utf8'))]));
const messages=dictionaries.de;
const normalize=text=>text.replace(/\s+/g,' ').trim();
let checked=0;
function requireMessage(text,file){
 const key=normalize(text);
 for(const [locale,dictionary] of Object.entries(dictionaries))assert(key && typeof dictionary[key]==='string' && dictionary[key].trim(),file+': missing '+locale+' message: '+key);
 checked++;
}
function requireArgument(node,file){if(ts.isStringLiteral(node))requireMessage(node.text,file);else if(ts.isConditionalExpression(node)){requireArgument(node.whenTrue,file);requireArgument(node.whenFalse,file);}}
const nameOf=(name,source)=>ts.isStringLiteral(name)?name.text:name.getText(source);
function walk(dir){
 for(const entry of readdirSync(dir,{withFileTypes:true})){
  const file=dir+'/'+entry.name;
  if(entry.isDirectory()){walk(file);continue;}
  if(!/\.[jt]sx?$/.test(file))continue;
  const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true,file.endsWith('x')?ts.ScriptKind.TSX:ts.ScriptKind.TS);
  const translated=/useTranslation|getTranslator/.test(source.text);
  function visit(node){
   if(ts.isJsxAttribute(node)&&['text','title','kicker','lede'].includes(node.name.getText(source))&&ts.isStringLiteral(node.initializer)&&file.endsWith('BetterGrowthHomepage.tsx'))requireMessage(node.initializer.text,file);
   if(ts.isJsxAttribute(node)&&node.name.getText(source)==='text'&&node.initializer&&ts.isJsxExpression(node.initializer)&&node.initializer.expression&&ts.isStringLiteral(node.initializer.expression)&&file.endsWith('BetterGrowthHomepage.tsx'))requireMessage(node.initializer.expression.text,file);
   if(ts.isCallExpression(node)&&node.expression.getText(source)==='t'&&node.arguments[0])requireArgument(node.arguments[0],file);
   if(translated){
    if(ts.isBindingElement(node)&&['title','introduction','contextLabel','placeholder','help','submitLabel'].includes(node.name.getText(source))&&node.initializer&&ts.isStringLiteral(node.initializer))requireMessage(node.initializer.text,file);
    if(ts.isPropertyAssignment(node)&&['title','blurb','q','a','label','desc'].includes(nameOf(node.name,source))&&ts.isStringLiteral(node.initializer))requireMessage(node.initializer.text,file);
    if(ts.isStringLiteral(node)&&ts.isArrayLiteralExpression(node.parent)&&/^[A-Z]/.test(node.text)&&!node.text.includes('@')&&!node.text.startsWith('Source: /')&&!node.text.startsWith('US$'))requireMessage(node.text,file);
   }
   ts.forEachChild(node,visit);
  }
  visit(source);
 }
}
walk('src');
for(const file of ['src/app/(english)/employers/situations.ts','src/app/(english)/employers/recruitment-pages.ts','src/app/(english)/truck-driver-recruitment/content.ts']){
 const source=ts.createSourceFile(file,readFileSync(file,'utf8'),ts.ScriptTarget.Latest,true);
 function visit(node){if(ts.isStringLiteral(node)&&node.text.includes(' '))requireMessage(node.text,file);ts.forEachChild(node,visit);}
 visit(source);
}
const output=ts.transpileModule(readFileSync('src/lib/i18n/shared.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const exports={};vm.runInNewContext(output,{exports});
for(const [locale,paths] of Object.entries(exports.localePaths))for(const path of paths){
 assert.equal(exports.localizedHref(path,'en'),path);
 const target='/'+locale+(path==='/'?'':path);
 assert.equal(exports.localizedHref(path,locale),target);
 assert.equal(exports.englishPath(target),path);
 assert.equal(exports.localizedHref(path+'?example=1#contact',locale),target+'?example=1#contact');
 for(const other of exports.languageOptions)assert.equal(exports.localizedHref(exports.localizedHref(path,other.code),locale),target);
}
for(const locale of ['de','cs','pl']){
 assert.equal(exports.localizedHref('/not-translated',locale),'/not-translated');
 assert.equal(exports.localizedHref('https://example.com',locale),'https://example.com');
 assert.equal(exports.localizedHref('#contact',locale),'#contact');
}
assert.equal(exports.translate(dictionaries.cs,'Email address'),'E-mailová adresa');
assert.equal(exports.translate(dictionaries.cs,'Email'),'Napište na');
assert.equal(exports.translate(messages,' Your name '),' Ihr Name ');
assert.equal(exports.translate({},'English source'),'English source');
assert.equal(exports.translate(messages,'Email address'),'E-Mail-Adresse');
assert.equal(exports.translate(messages,'Email'),'Schreiben Sie an');

// A source edit must not silently leave a translated article partly in English.
const articleFile='src/lib/insights/content.ts';
const articleSource=ts.createSourceFile(articleFile,readFileSync(articleFile,'utf8'),ts.ScriptTarget.Latest,true);
let articleChecks=0;
function inspectArticle(node){
 if(ts.isObjectLiteralExpression(node)){
  const slug=node.properties.find(p=>ts.isPropertyAssignment(p)&&nameOf(p.name,articleSource)==='slug'&&ts.isStringLiteral(p.initializer));
  if(slug)for(const paths of Object.values(exports.localePaths))assert(paths.includes('/insights/'+slug.initializer.text),'Every published Insight must have a translated route: '+slug.initializer.text);
  if(slug&&exports.germanPaths.includes('/insights/'+slug.initializer.text)){
   function visit(n){
    if(ts.isPropertyAssignment(n)){
     if(['slug','slugParts','href','type'].includes(nameOf(n.name,articleSource)))return;
     visit(n.initializer);return;
    }
    if(ts.isStringLiteral(n)){requireMessage(n.text,articleFile);articleChecks++;}
    ts.forEachChild(n,visit);
   }
   node.properties.forEach(visit);return;
  }
 }
 ts.forEachChild(node,inspectArticle);
}
inspectArticle(articleSource);
console.log('LOCALES PASS: '+checked+' references including '+articleChecks+' article fields; '+Object.entries(dictionaries).map(([locale,dict])=>locale+': '+Object.keys(dict).length+' messages').join('; ')+'; four-language equivalent URLs and fallbacks verified.');
