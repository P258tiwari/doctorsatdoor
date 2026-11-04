import { NextRequest } from 'next/server';
// request.nextUrl is the app's internal address behind nginx, so use the proxied Host plus the configured site URL.
function siteHostnames(request: NextRequest){
 const hostOf=(value:string|null|undefined)=>value?.split(',')[0].trim().split(':')[0];
 const site=process.env.NEXT_PUBLIC_SITE_URL;
 return new Set([hostOf(request.headers.get('x-forwarded-host')),hostOf(request.headers.get('host')),site&&new URL(site).hostname,...(process.env.TURNSTILE_ALLOWED_HOSTNAMES||'').split(',').map(s=>s.trim())].filter(Boolean));
}
export async function verifyTurnstile(request: NextRequest, token: unknown, action: string) {
 const secret=process.env.TURNSTILE_SECRET_KEY;
 if(!secret)console.error('TURNSTILE_SECRET_KEY is not set: every form submission will be rejected');
 if(!secret||typeof token!=='string'||!token||token.length>2048)return false;
 try {
  const result=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret,response:token}),signal:AbortSignal.timeout(10000),cache:'no-store'});
  const data=await result.json();
  const allowed=result.ok&&data.success===true&&data.action===action&&siteHostnames(request).has(data.hostname);
  if(!allowed)console.warn('Turnstile rejected',{codes:data['error-codes'],action:data.action,hostname:data.hostname});
  return allowed;
 }catch{return false;}
}
export function formError(message:string,status:number){return Response.json({message},{status,headers:{'Cache-Control':'no-store'}});}
export function sameOrigin(request: NextRequest){
 try{return siteHostnames(request).has(new URL(request.headers.get('origin')||'').hostname);}catch{return false;}
}
// Rightmost X-Forwarded-For entry is the one nginx added, so a client cannot fake it.
// ponytail: per-process memory, fine for one server; move to nginx or Redis if it ever runs as several instances.
const recentRequests=new Map<string,number[]>();
function overLimit(request: NextRequest){
 const ip=request.headers.get('x-forwarded-for')?.split(',').pop()?.trim()||'unknown';
 const key=`${ip} ${request.nextUrl.pathname}`,now=Date.now();
 const recent=(recentRequests.get(key)||[]).filter(time=>now-time<60000);
 recent.push(now);
 if(recentRequests.size>10000)recentRequests.clear();
 recentRequests.set(key,recent);
 return recent.length>10;
}
// Shared gate for form endpoints. Returns the parsed body, or the error Response to send back.
// ponytail: chunked bodies are only size-checked after buffering; nginx client_max_body_size covers those.
export async function readFormBody(request: NextRequest, maxBytes: number){
 if(!sameOrigin(request))return formError('Request not allowed.',403);
 if(overLimit(request))return formError('Too many requests. Please wait a minute and try again.',429);
 if(!request.headers.get('content-type')?.includes('application/json'))return formError('Expected JSON.',415);
 if(Number(request.headers.get('content-length'))>maxBytes)return formError('Request too large.',413);
 try{
  const text=await request.text();
  if(text.length>maxBytes)return formError('Request too large.',413);
  const body=JSON.parse(text);
  return body&&typeof body==='object'?body as Record<string,unknown>:formError('Invalid request.',400);
 }catch{return formError('Invalid request.',400);}
}
