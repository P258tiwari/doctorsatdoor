import { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("DAD Diagnostic (coming soon)","Planned software that connects diagnostic centres with doctors and patients.","/dad-diagnostic");
export default function Page(){return <ProductLanding name="Diagnostic" headline="A clearer next step." description="Planned software that connects diagnostic centres with doctors and patients." photo="diagnostics" type="diagnostic" features={[["Test requests","Receive test requests from doctors and manage them in one place."],["Appointments","Help patients see their upcoming test date and time."],["Report delivery","Upload reports so patients can find them with their other reports."],["Follow-up","Make it easier for the doctor to review results and plan the next step."]]}/>;}
