"use client";

import { Turnstile } from '@/components/ui/Turnstile';
import React, { useEffect, useRef, useState } from "react";
import { Trash2, CheckCircle2, AlertCircle, Copy, Check } from "lucide-react";
import { submitAccountDeletion } from "@/lib/forms";

export function AccountDeletionClient() {
  const [formData, setFormData] = useState({
    name: "",
    emailOrPhone: "",
    accountIdentifier: "",
    reason: "",
    confirmed: false,
  });
  const [captchaToken,setCaptchaToken]=useState('');
  const [captchaReset,setCaptchaReset]=useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const confirmation = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!submitted) return;
    const frame = requestAnimationFrame(() => {
      const panel = confirmation.current;
      if (!panel) return;
      panel.focus({ preventScroll: true });
      panel.scrollIntoView({ block: 'start', behavior: 'instant' });
    });
    return () => cancelAnimationFrame(frame);
  }, [submitted]);
  const [errorMsg, setErrorMsg] = useState("");
  const [requestId, setRequestId] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.name || !formData.emailOrPhone || !formData.accountIdentifier) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!formData.confirmed) {
      setErrorMsg("You must confirm that you understand this action is permanent and irreversible.");
      return;
    }

    if(!captchaToken){setErrorMsg('Please complete the verification.');return;}
    setIsSubmitting(true);
    try {
      const res = await submitAccountDeletion({
        name: formData.name,
        email_or_phone: formData.emailOrPhone,
        account_identifier: formData.accountIdentifier,
        reason: formData.reason,
      }, captchaToken);

      if (res.success) {
        setRequestId(res.id);
        setSubmitted(true);
      }
    } catch (err: unknown) {
      setErrorMsg(`${err instanceof Error ? err.message : "Failed to submit request."} You can also email privacy@doctorsatdoor.com.`);
    } finally {
      setIsSubmitting(false);setCaptchaToken('');setCaptchaReset(n=>n+1);
    }
  };

  if (submitted) {
    return (
      <div ref={confirmation} tabIndex={-1} role="status" aria-live="polite" aria-label="Submission confirmation" style={{ scrollMarginTop: 130 }} className="rounded-3xl border border-slate-200 bg-slate-50 p-8 sm:p-10 text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Deletion Request Registered
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Your request has been officially recorded.
        </p>
        <div className="deletion-reference">
          <span className="deletion-reference-label">REFERENCE ID</span>
          <div className="deletion-reference-value"><code>{requestId}</code><button type="button" aria-label={copyMessage === 'Reference ID copied.' ? 'Reference ID copied' : 'Copy reference ID'} title="Copy reference ID" onClick={async () => {
            try { await navigator.clipboard.writeText(requestId); setCopyMessage('Reference ID copied.'); }
            catch { setCopyMessage('Unable to copy automatically. Select and copy the reference ID.'); }
          }}>{copyMessage === 'Reference ID copied.' ? <Check size={18} /> : <Copy size={18} />}</button></div>
          {copyMessage && <small role="status">{copyMessage}</small>}
        </div>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Our team will review your request and contact you to verify your identity before any account data is deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="deletion-form-panel space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">
          Account Deletion Request Form
        </h2>
        <p className="text-xs text-slate-500 mt-1">
          Provide your account details to initiate verified data purge.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="deletion-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Full Name *
          </label>
          <input
            id="deletion-name"
            type="text"
            required
            placeholder="e.g. Rajesh Sharma"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="deletion-contact" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Registered Email or Phone Number *
          </label>
          <input
            id="deletion-contact"
            type="text"
            required
            placeholder="e.g. rajesh@gmail.com or +91 98200 00000"
            value={formData.emailOrPhone}
            onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="deletion-account" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Account Identifier / DAD Report Username *
          </label>
          <input
            id="deletion-account"
            type="text"
            required
            placeholder="e.g. rajesh_sharma or account profile ID"
            value={formData.accountIdentifier}
            onChange={(e) => setFormData({ ...formData, accountIdentifier: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="deletion-reason" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Reason for Deletion (Optional)
          </label>
          <textarea
            id="deletion-reason"
            rows={3}
            placeholder="Tell us why you are deleting your account (e.g., no longer needing record organization, switching providers)..."
            value={formData.reason}
            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
          ></textarea>
        </div>

        <div className="pt-2">
          <label className="deletion-confirmation">
            <input
              type="checkbox"
              required
              checked={formData.confirmed}
              onChange={(e) => setFormData({ ...formData, confirmed: e.target.checked })}
              className="mt-1 w-4 h-4 text-rose-600 rounded border-slate-300"
            />
            <span className="text-xs text-slate-700 leading-snug">
              I understand that submitting this request initiates irreversible deletion of my medical records, AI summaries, and account history from DAD Report.
            </span>
          </label>
        </div>
          <Turnstile action="deletion" onToken={setCaptchaToken} resetKey={captchaReset}/>


        <button
          type="submit"
          disabled={isSubmitting || !captchaToken}
          className="w-full py-3.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Submitting Deletion Request...</span>
          ) : (
            <>
              <Trash2 className="w-4 h-4" />
              <span>Submit Irreversible Account Deletion Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}

