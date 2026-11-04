import { Pool } from 'pg';
// ponytail: set DATABASE_CA_CERT (Supabase dashboard > Database > SSL) to verify the server; without it TLS encrypts but does not authenticate.
const globalPool=globalThis as unknown as { formPool?: Pool };
export function formDatabase(){
 if(!process.env.DATABASE_URL)throw new Error('Database unavailable');
 return globalPool.formPool??=new Pool({connectionString:process.env.DATABASE_URL,max:3,idleTimeoutMillis:10000,connectionTimeoutMillis:10000,ssl:process.env.DATABASE_CA_CERT?{ca:process.env.DATABASE_CA_CERT.replace(/\\n/g,'\n')}:{rejectUnauthorized:false}});
}
