'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';

type TurnstileApi = { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: TurnstileApi } }
export function Turnstile({ action, onToken, resetKey = 0 }: { action: string; onToken: (token: string) => void; resetKey?: number }) {
 const container=useRef<HTMLDivElement>(null), callback=useRef(onToken);
 const [ready,setReady]=useState(false),[error,setError]=useState('');
 const [interacting,setInteracting]=useState(false);
 const [compact,setCompact]=useState<boolean|null>(null);
 const sitekey=process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
 useEffect(()=>{callback.current=onToken;},[onToken]);
 useEffect(()=>{
  const element=container.current;
  if(!element)return;
  const observer=new ResizeObserver(([entry])=>setCompact(entry.contentRect.width<300));
  observer.observe(element);
  return()=>observer.disconnect();
 },[]);
 useEffect(()=>{
  if(!ready||compact===null||!sitekey||!container.current||!window.turnstile)return;
  callback.current('');
  const id=window.turnstile.render(container.current,{
   sitekey,action,theme:'light',size:compact?'compact':'flexible',appearance:'interaction-only',
   callback:(token:string)=>{setError('');setInteracting(false);callback.current(token);},
   'before-interactive-callback':()=>setInteracting(true),
   'after-interactive-callback':()=>setInteracting(false),
   'expired-callback':()=>callback.current(''),
   'error-callback':(code:string)=>{callback.current('');setError(`Verification could not load. Please refresh and try again. (Code: ${code})`);}
  });
  return()=>{window.turnstile?.remove(id);};
 },[ready,sitekey,action,resetKey,compact]);
 return <div data-verification style={{width:'100%',minWidth:0,gridColumn:'1 / -1',marginBlock:interacting||error||!sitekey?14:0}}>
  <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onReady={()=>setReady(true)} onError={()=>setError('Verification could not load. Please refresh and try again.')}/>
  {/* Keep the widget mounted and measurable for background verification, but
      only reserve visible space while Cloudflare needs user interaction. */}
  <div data-verification-challenge aria-hidden={!interacting} style={{width:'100%',height:interacting?'auto':0,overflow:interacting?'visible':'hidden',visibility:interacting?'visible':'hidden'}}>
   <div ref={container} style={{width:'100%'}}/>
  </div>
  {(!sitekey||error)&&<p role="alert" style={{fontSize:14,color:'#a6506b'}}>{error||'Verification is not configured. Please contact support.'}</p>}
 </div>;
}
