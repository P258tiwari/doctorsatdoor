import { articleHtmlWithSections } from '@/lib/cms/html';
export function articleSections(content:string){return articleHtmlWithSections(content).sections;}
export function ArticleBody({content}:{content:string}){return <div className="journal-prose" dangerouslySetInnerHTML={{__html:articleHtmlWithSections(content).html}}/>;}
