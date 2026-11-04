'use client';
/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react';
import { ArrowUpFromLine, ImagePlus, LoaderCircle, RefreshCw, X } from 'lucide-react';
import { uploadMedia, errorText } from '@/lib/cms/client';
import { CmsDialog } from './CmsDialog';
export function ImageInsertDialog({onClose,onInsert}:{onClose:()=>void;onInsert:(src:string,alt:string)=>void}) {
 const input=useRef<HTMLInputElement>(null);
 const [file,setFile]=useState<File|null>(null),[preview,setPreview]=useState(''),[alt,setAlt]=useState(''),[busy,setBusy]=useState(false),[error,setError]=useState(''),[dragging,setDragging]=useState(false);
 useEffect(()=>()=>{if(preview)URL.revokeObjectURL(preview);},[preview]);
 function choose(next?:File){if(!next||busy)return;setError('');if(!['image/jpeg','image/png','image/webp','image/gif'].includes(next.type)){setError('Choose a JPG, PNG, WebP or GIF image.');return;}if(next.size>10485760){setError('Please choose an image under 10 MB.');return;}setFile(next);setPreview(URL.createObjectURL(next));}
 return <CmsDialog title="Add an image" onClose={()=>{if(!busy)onClose();}}><form className="cms-image-form" onSubmit={async e=>{e.preventDefault();if(!file||busy)return;setBusy(true);setError('');try{const src=await uploadMedia(file);onInsert(src,alt.trim());}catch(e){setError(errorText(e));}finally{setBusy(false);}}}>
 <p className="cms-image-intro">Give your story a little more perspective.</p>
 <input ref={input} hidden type="file" aria-label="Choose article image" accept="image/png,image/jpeg,image/webp,image/gif" disabled={busy} onChange={e=>{choose(e.target.files?.[0]);e.target.value='';}}/>
 <div className={`cms-image-dropzone ${dragging?'is-dragging':''}`} onDragOver={e=>{e.preventDefault();if(!busy)setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={e=>{e.preventDefault();setDragging(false);choose(e.dataTransfer.files[0]);}}>
 {preview?<><div className="cms-image-preview"><img src={preview} alt={alt||'Selected image preview'} onError={()=>{setFile(null);setPreview('');setError('This image could not be opened. Choose another file.');}}/></div><div className="cms-image-file"><ImagePlus size={18}/><div><strong>{file?.name}</strong><small>{file&&`${Math.max(1,Math.round(file.size/1024))} KB`} · Ready to insert</small></div><button type="button" className="cms-icon" disabled={busy} aria-label="Remove selected image" onClick={()=>{setFile(null);setPreview('');}}><X size={16}/></button></div></>:<button className="cms-image-drop-target" type="button" onClick={()=>input.current?.click()}><span className="cms-image-upload-icon"><ArrowUpFromLine size={24}/></span><strong>Drop your image here</strong><span>or <u>browse files</u> on your computer</span><small>JPG, PNG, WebP or GIF · Up to 10 MB</small></button>}
 </div>
 {file&&<button type="button" className="cms-image-replace" disabled={busy} onClick={()=>input.current?.click()}><RefreshCw size={13}/> Choose a different image</button>}
 <label className="cms-field cms-image-description"><span>Image description <small>Alt text</small></span><input value={alt} disabled={busy} maxLength={500} onChange={e=>setAlt(e.target.value)} placeholder="e.g. A doctor reviewing a report with a patient"/><small>Describe what the image shows for people using screen readers.</small></label>
 {error&&<p className="cms-image-error" role="alert">{error}</p>}
 <footer className="cms-image-actions"><span>{busy?'Uploading your image…':'Inserted at your selected position'}</span><div><button type="button" className="cms-secondary" disabled={busy} onClick={onClose}>Cancel</button><button type="submit" className="cms-primary" disabled={!file||busy}>{busy?<LoaderCircle size={16}/>:<ImagePlus size={16}/>} {busy?'Uploading…':'Insert image'}</button></div></footer>
 </form></CmsDialog>;
}
