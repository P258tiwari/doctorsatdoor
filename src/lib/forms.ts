import type { AccountDeletionRequest, LeadInquiry } from '@/types';

async function post(url: string, body: unknown): Promise<{success:boolean;id:string}> {
 let response:Response,result;
 try{response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});result=await response.json();}
 catch{throw new Error('We could not reach our server. Please check your connection and try again.');}
 if(!response.ok)throw new Error(result.message||'We could not submit the form. Please try again.');return result;
}
export function submitLeadInquiry(inquiry: Omit<LeadInquiry, 'id' | 'status' | 'created_at'>, captchaToken: string) {
 return post('/api/inquiries',{...inquiry,captchaToken});
}
export function submitAccountDeletion(data: Omit<AccountDeletionRequest, 'id' | 'status' | 'created_at'>, captchaToken: string) {
 return post('/api/deletion-requests',{...data,captchaToken,confirmed:true});
}
