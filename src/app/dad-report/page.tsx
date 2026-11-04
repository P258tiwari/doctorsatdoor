import { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("DAD Report: Your Health History, Connected","Organise medical records, understand reports, manage family profiles and share your health history with DAD Report.","/dad-report");
export default function DadReportPage() {
 return <ProductLanding name="Report" headline="A little clarity." description="Your family’s health records, organised with AI. Understand reports with simple AI summaries and keep your health history together with DAD Report." photo="family-report-upload-v2" type="patient" live features={[["Health timeline","Find reports in the context of your health journey."],["AI explanations","Understand medical language and prepare questions for your doctor."],["Family profiles","Keep everyone’s records connected to the right person."],["Treatment folders","Group documents around a condition, treatment, or care episode."],["Insurance summaries","Review key policy information alongside the original document."],["Doctor follow-up","Share relevant reports and request follow-up through Doctor PING."],["Diagnostic updates","Keep diagnostic appointment information alongside your records."],["AI organisation","Spend less time sorting documents and more time seeing the bigger picture."]]}/>;
}
