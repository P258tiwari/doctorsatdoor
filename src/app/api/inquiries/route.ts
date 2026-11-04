import { NextRequest } from 'next/server';
import { verifyTurnstile, readFormBody, formError as fail } from '@/lib/server/turnstile';
import { formDatabase } from '@/lib/server/form-database';
export async function POST(request:NextRequest){
 const body=await readFormBody(request,20000);
 if(body instanceof Response)return body;
 const str=(k:string,max:number)=>{const value=body[k];return typeof value==='string'?value.trim().slice(0,max):'';};
 const full_name=str('full_name',200),email=str('email',254),message=str('message',10000),type=str('inquiry_type',30);
 if(!full_name||!message||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||!['patient','doctor','diagnostic','clinic','investor','partnership','other'].includes(type))return fail('Please enter valid contact details and a message.',400);
 if(!await verifyTurnstile(request,body.captchaToken,'inquiry'))return fail('Please complete the verification and try again.',403);
 try{const id=crypto.randomUUID();await formDatabase().query('insert into public.lead_inquiries(id,full_name,email,phone,city,organization,inquiry_type,subject,message,status) values($1,$2,$3,$4,$5,$6,$7,$8,$9,\'new\')',[id,full_name,email,str('phone',50),str('city',200),str('organization',300),type,str('subject',300),message]);return Response.json({success:true,id},{headers:{'Cache-Control':'no-store'}});}catch(error){console.error('Inquiry insert failed:',error instanceof Error?error.message:error);return fail('Could not submit your message. Please try again later.',503);}
}
