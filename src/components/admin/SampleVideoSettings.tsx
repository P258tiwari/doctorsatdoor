"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpFromLine, ArrowUpRight, Film } from "lucide-react";
import { errorText, uploadSampleVideo } from "@/lib/cms/client";
import { getSampleVideo, type SampleVideo } from "@/lib/supabase/data-service";

export function SampleVideoSettings({ canEdit }: { canEdit: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [video, setVideo] = useState<SampleVideo | null>(null);
  const [busy, setBusy] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getSampleVideo().then(setVideo).catch((e) => setError(errorText(e)));
  }, []);

  async function replaceVideo(file?: File) {
    if (!file || busy) return;
    setBusy(true);
    setError("");
    setMessage("Uploading. Please keep this page open.");
    try {
      setVideo(await uploadSampleVideo(file, video?.url));
      setMessage("Video updated. The public page shows it within about a minute.");
    } catch (e) {
      setMessage("");
      setError(errorText(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby="sample-video-title" className="workspace-video p-6 rounded-2xl bg-white border border-slate-200">
      <header className="workspace-video-head">
        <div>
          <h2 id="sample-video-title">Sample video</h2>
          <p>The walkthrough visitors watch on the public sample page.</p>
        </div>
        <a href="/sampleaivideo" target="_blank" rel="noopener noreferrer" className="workspace-video-link">
          View page <ArrowUpRight size={15} />
        </a>
      </header>

      <div className="workspace-video-body">
        <div className="workspace-video-frame">
          {video && <video key={video.url} src={video.url} controls playsInline preload="metadata" />}
        </div>

        <div className="workspace-video-side">
          {video && (
            <div className="workspace-video-file">
              <span><Film size={18} /></span>
              <div>
                <small>Current file</small>
                <strong title={video.name}>{video.name}</strong>
              </div>
            </div>
          )}

          {canEdit ? (
            <>
              <input ref={input} hidden type="file" aria-label="Choose a replacement video" accept="video/mp4,video/webm" disabled={busy} onChange={(e) => { replaceVideo(e.target.files?.[0]); e.target.value = ""; }} />
              <button
                type="button"
                className={`workspace-video-drop ${dragging ? "is-dragging" : ""}`}
                disabled={busy}
                onClick={() => input.current?.click()}
                onDragOver={(e) => { e.preventDefault(); if (!busy) setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); replaceVideo(e.dataTransfer.files[0]); }}
              >
                <span><ArrowUpFromLine size={22} /></span>
                <strong>{busy ? "Uploading video" : "Drop a new video here"}</strong>
                {!busy && <em>or <u>browse files</u> on your computer</em>}
                <small>MP4 or WebM · Up to 50 MB · Replaces the live video right away</small>
              </button>
            </>
          ) : (
            <p className="workspace-video-note">Only a super admin can change this video.</p>
          )}

          {message && <p role="status" className="workspace-video-note">{message}</p>}
          {error && <p role="alert" className="workspace-error">{error}</p>}
        </div>
      </div>
    </section>
  );
}
