"use client";

import { Turnstile } from '@/components/ui/Turnstile';
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { submitLeadInquiry } from "@/lib/forms";
import { LeadType } from "@/types";
import { cn } from "@/lib/utils";

interface ContactFormClientProps {
  defaultType?: string;
}

const INQUIRY_TYPES: { id: LeadType; label: string; desc: string }[] = [
  { id: "investor", label: "Funding / Investor", desc: "Venture capital, angels & institutional investors" },
  { id: "clinic", label: "Clinic / Hospital", desc: "OPD practices & consulting doctor networks" },
  { id: "diagnostic", label: "Diagnostic / Lab", desc: "Pathology labs & imaging scan centers" },
  { id: "doctor", label: "Doctor / Specialist", desc: "Individual practitioners & specialist clinics" },
  { id: "patient", label: "Patient / Family User", desc: "DAD Report users & individual accounts" },
  { id: "partnership", label: "Partnership / Other", desc: "Media, APIs, research & cross-platform" },
];

export function ContactFormClient({ defaultType }: ContactFormClientProps) {
  const searchParams = useSearchParams();
  const queryType = searchParams?.get("type") || defaultType;

  const initialType = (
    INQUIRY_TYPES.some((t) => t.id === queryType) ? queryType : "investor"
  ) as LeadType;

  const [inquiryType, setInquiryType] = useState<LeadType>(initialType);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    organization: "",
    subject: "",
    message: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if(!captchaToken){setErrorMsg('Please complete the verification.');return;}
    setIsSubmitting(true);
    try {
      const res = await submitLeadInquiry({
        full_name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        organization: formData.organization,
        inquiry_type: inquiryType,
        subject: formData.subject || `Inquiry: ${inquiryType.toUpperCase()}`,
        message: formData.message,
      }, captchaToken);

      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg("Submission failed. Please try again or email us directly.");
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);setCaptchaToken('');setCaptchaReset(n=>n+1);
    }
  };

  if (submitted) {
    return (
      <div ref={confirmation} tabIndex={-1} role="status" aria-live="polite" aria-label="Submission confirmation" style={{ scrollMarginTop: 130 }} className="rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 sm:p-12 text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">
          Message Received
        </h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Doctors At Door. Your submission has been securely logged into our coordination system. Our team will review your requirements and reach out within 24 business hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              city: "",
              organization: "",
              subject: "",
              message: "",
            });
          }}
          className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
        >
          Send another message &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="contact-form-panel space-y-6">
      <div>
        <h3 className="text-xl font-bold text-slate-900">
          Tell us what you have in mind.
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Choose a topic and tell us how we can help.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Category Selector Grid */}
      <div className="space-y-2">
        <p className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          1. Select Your Category *
        </p>
        <div className="contact-categories">
          {INQUIRY_TYPES.map((type) => {
            const isSelected = inquiryType === type.id;
            return (
              <button
                key={type.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setInquiryType(type.id)}
                className={cn(
                  "p-3 rounded-xl border text-left text-xs transition-all flex flex-col justify-between min-h-24",
                  isSelected
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                    : "bg-slate-50 hover:bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                )}
              >
                <span className="font-bold block leading-tight">{type.label}</span>
                <span
                  className={cn(
                    "text-[10px] line-clamp-2 mt-1",
                    isSelected ? "text-indigo-100" : "text-slate-500"
                  )}
                >
                  {type.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          2. Enter Your Details *
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-field-0" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Full Name *
            </label>
            <input id="contact-field-0"
              type="text"
              required
              placeholder="e.g. Dr. Ananya Sharma"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="contact-field-1" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Work / Personal Email *
            </label>
            <input id="contact-field-1"
              type="email"
              required
              placeholder="e.g. ananya@domain.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="contact-field-2" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Phone / WhatsApp
            </label>
            <input id="contact-field-2"
              type="tel"
              placeholder="+91 98200 00000"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="contact-field-3" className="block text-[11px] font-semibold text-slate-600 mb-1">
              City / State
            </label>
            <input id="contact-field-3"
              type="text"
              placeholder="e.g. Mumbai, MH"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="contact-field-4" className="block text-[11px] font-semibold text-slate-600 mb-1">
              Organization (Optional)
            </label>
            <input id="contact-field-4"
              type="text"
              placeholder="e.g. Apex Health Labs"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-field-5" className="block text-[11px] font-semibold text-slate-600 mb-1">
            Subject
          </label>
            <input id="contact-field-5"
            type="text"
            placeholder="e.g. Exploring Series Seed / Clinic Pilot Inquiry"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="contact-field-6" className="block text-[11px] font-semibold text-slate-600 mb-1">
            Message &bull; How can we collaborate? *
          </label>
            <textarea id="contact-field-6"
            rows={4}
            required
            placeholder="Describe your clinic, fund, laboratory test volume, or specific collaboration interest..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none"
          ></textarea>
        </div>
          <Turnstile action="inquiry" onToken={setCaptchaToken} resetKey={captchaReset}/>


        <button
          type="submit"
          disabled={isSubmitting || !captchaToken}
          className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
        >
          {isSubmitting ? (
            <span>Sending message...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </>
          )}
        </button>

        <p className="text-center text-xs text-slate-500">
          Your details help us respond to your inquiry. Please do not include medical records.
        </p>
      </form>
    </div>
  );
}
