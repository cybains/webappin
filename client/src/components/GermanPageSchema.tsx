import {SITE_URL} from '@/lib/seo';
import {serializeSchema,organizationId,websiteId} from '@/lib/structured-data';
import {germanPages} from '@/lib/i18n/pages';
export default function GermanPageSchema({path}:{path:keyof typeof germanPages}) {
const page=germanPages[path],url=SITE_URL+(path==='/'?'/de':'/de'+path);
const specialist=path==='/truck-driver-recruitment'||path==='/austria-seasonal-workers';
const service=['/','/employers','/truck-driver-recruitment','/austria-seasonal-workers','/work-in-europe'].includes(path);
const crumbs=[{name:'Startseite',url:SITE_URL+'/de'},...(specialist?[{name:'Für Unternehmen',url:SITE_URL+'/de/employers'}]:[]),{name:page.name,url}];
const graph=[{'@type':path==='/about'?'AboutPage':path==='/insights'?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:page.title,description:page.description,inLanguage:'de',isPartOf:{'@id':websiteId},publisher:{'@id':organizationId},...(path!=='/'?{breadcrumb:{'@id':url+'#breadcrumb'}}:{}),...(service?{mainEntity:{'@id':url+'#service'}}:{})},...(service?[{'@type':'Service','@id':url+'#service',name:page.name,description:page.description,url,provider:{'@id':organizationId},areaServed:{'@type':'Place',name:path==='/austria-seasonal-workers'?'Österreich':'Europa'}}]:[]),...(path!=='/'?[{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:item.url}))}]:[])];return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeSchema({'@context':'https://schema.org','@graph':graph})}}/>;
}
