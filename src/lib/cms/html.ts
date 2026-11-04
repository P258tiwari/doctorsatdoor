import sanitizeHtml from "sanitize-html";
import { marked } from "marked";
import { articleImage } from '@/lib/article-images';

export function cleanArticleHtml(html: string) {
  return sanitizeHtml(html, {
    allowedTags: ['p','br','h2','h3','h4','h5','h6','strong','b','em','i','u','s','blockquote','ul','ol','li','a','img','figure','figcaption','hr','pre','code'],
    allowedAttributes: { a:['href','title','target','rel'], img:['src','alt','title','width','height','loading','decoding'], '*':['style'] },
    allowedStyles: { '*': { 'text-align': [/^(left|center|right|justify)$/] } },
    allowedSchemes: ['http','https','mailto','tel'],
    allowedSchemesByTag: { img:['https'] },
    allowProtocolRelative: false,
    transformTags: {
      a: (tagName, attribs) => ({ tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } }),
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, ...articleImage(attribs.src || '', attribs.alt) as Record<string, string>, loading: 'lazy', decoding: 'async' } }),
    },
  });
}
export function toArticleHtml(content: string, format?: string) {
  return cleanArticleHtml(format === 'html' || /^\s*<(p|h[2-6]|blockquote|ul|ol|figure)\b/.test(content) ? content : marked.parse(content, { async:false }) as string);
}
export function articleHtmlWithSections(content: string, format?: string) {
  const sections: {id:string;title:string;level:number}[]=[];
  const html=toArticleHtml(content,format).replace(/<h([2-6])([^>]*)>([\s\S]*?)<\/h\1>/g,(_match,level,attrs,title)=>{
    const id=`section-${sections.length}`;
    sections.push({id,title:sanitizeHtml(title,{allowedTags:[],allowedAttributes:{}}).replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'"),level:Number(level)});
    return `<h${level}${attrs} id="${id}">${title}</h${level}>`;
  });
  return {html,sections};
}
