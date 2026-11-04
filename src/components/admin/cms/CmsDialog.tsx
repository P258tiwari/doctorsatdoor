'use client';
import {useEffect,useRef,type ReactNode} from 'react';
import {X} from 'lucide-react';
export function CmsDialog({title,onClose,children,wide=false}:{title:string;onClose:()=>void;children:ReactNode;wide?:boolean}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const d=ref.current;d?.showModal();const previous=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{d?.close();document.body.style.overflow=previous;};},[]);
 return <dialog ref={ref} className={`cms-dialog ${wide?'cms-dialog-wide':''}`} aria-label={title} onCancel={e=>{e.preventDefault();onClose();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose();}}}><header className="cms-dialog-header"><h2>{title}</h2><button type="button" className="cms-icon" aria-label="Close dialog" onClick={onClose}><X size={20}/></button></header><div className="cms-dialog-body">{children}</div></dialog>;
}
