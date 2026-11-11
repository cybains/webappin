import {SITE_URL} from '@/lib/seo';
import {serializeSchema,organizationId,websiteId} from '@/lib/structured-data';
import {germanPages,czechPages,polishPages} from '@/lib/i18n/pages';
export default function LocalizedPageSchema({path,locale="de"}:{path:keyof typeof germanPages;locale?:"de"|"cs"|"pl"}) {
const page=({de:germanPages,cs:czechPages,pl:polishPages}[locale])[path],prefix="/"+locale,url=SITE_URL+prefix+(path==='/'?'':path);
const specialist=path==='/truck-driver-recruitment'||path==='/austria-seasonal-workers';
const service=['/','/employers','/truck-driver-recruitment','/austria-seasonal-workers','/work-in-europe'].includes(path);
const crumbs=[{name:{de:'Startseite',cs:'Úvod',pl:'Strona główna'}[locale],url:SITE_URL+prefix},...(specialist?[{name:{de:'Für Unternehmen',cs:'Pro zaměstnavatele',pl:'Dla pracodawców'}[locale],url:SITE_URL+prefix+'/employers'}]:[]),{name:page.name,url}];
const graph=[{'@type':path==='/about'?'AboutPage':path==='/insights'?'CollectionPage':'WebPage','@id':url+'#webpage',url,name:page.title,description:page.description,inLanguage:locale,isPartOf:{'@id':websiteId},publisher:{'@id':organizationId},...(path!=='/'?{breadcrumb:{'@id':url+'#breadcrumb'}}:{}),...(service?{mainEntity:{'@id':url+'#service'}}:{})},...(service?[{'@type':'Service','@id':url+'#service',name:page.name,description:page.description,url,provider:{'@id':organizationId},areaServed:{'@type':'Place',name:path==='/austria-seasonal-workers'?({de:'Österreich',cs:'Rakousko',pl:'Austria'}[locale]):({de:'Europa',cs:'Evropa',pl:'Europa'}[locale])}}]:[]),...(path!=='/'?[{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:crumbs.map((item,index)=>({'@type':'ListItem',position:index+1,name:item.name,item:item.url}))}]:[])];return <script type="application/ld+json" dangerouslySetInnerHTML={{__html:serializeSchema({'@context':'https://schema.org','@graph':graph})}}/>;
}
