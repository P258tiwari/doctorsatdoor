import { NextRequest } from 'next/server';
import { verifyTurnstile, readFormBody, formError as fail } from '@/lib/server/turnstile';
import { formDatabase } from '@/lib/server/form-database';
export async function POST(request:NextRequest){
 const body=await readFormBody(request,10000);
 if(body instanceof Response)return body;
 const str=(k:string,max:number)=>{const value=body[k];return typeof value==='string'?value.trim().slice(0,max):'';};
 const name=str('name',200),contact=str('email_or_phone',254),identifier=str('account_identifier',300);
 if(!name||!contact||!identifier||body.confirmed!==true)return fail('Please complete the required details and confirmation.',400);
 if(!await verifyTurnstile(request,body.captchaToken,'deletion'))return fail('Please complete the verification and try again.',403);
 try{const id=crypto.randomUUID();await formDatabase().query('insert into public.account_deletion_requests(id,name,email_or_phone,account_identifier,reason,status) values($1,$2,$3,$4,$5,\'pending\')',[id,name,contact,identifier,str('reason',5000)]);return Response.json({success:true,id},{headers:{'Cache-Control':'no-store'}});}catch(error){console.error('Deletion request insert failed:',error instanceof Error?error.message:error);return fail('Could not submit your request. Please try again later.',503);}
}
