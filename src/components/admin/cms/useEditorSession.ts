'use client';
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
// Editor contents are removed on logout/revocation, including cross-tab logout.
export function useEditorSession(onDenied: () => void) {
 useEffect(() => {
  if (!supabase) return;
  let active = true;
  const verify = async () => {
   try {
    const {data,error}=await supabase!.auth.getUser();
    if(!active)return;
    if(error||!data.user){onDenied();return;}
    const membership=await supabase!.from('admin_users').select('role').eq('auth_user_id',data.user.id).single();
    if(active&&(membership.error||!['super_admin','content_admin'].includes(membership.data?.role)))onDenied();
   } catch {if(active)onDenied();}
  };
  const {data}=supabase.auth.onAuthStateChange((event,session)=>{if(!session||event==='SIGNED_OUT')onDenied();else setTimeout(()=>{if(active)void verify();},0);});
  window.addEventListener('focus',verify);const timer=setInterval(verify,60000);
  return()=>{active=false;data.subscription.unsubscribe();window.removeEventListener('focus',verify);clearInterval(timer);};
 },[onDenied]);
}
