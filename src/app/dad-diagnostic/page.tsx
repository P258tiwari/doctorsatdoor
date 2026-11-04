import { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("DAD Diagnostic (Coming Soon)","A future connection between diagnostic services, care teams, and patient information.","/dad-diagnostic");
export default function Page(){return <ProductLanding name="Diagnostic" headline="A clearer next step." description="A future connection between diagnostic services, care teams, and patient information." photo="diagnostics" type="diagnostic" features={[["Diagnostic coordination","Bring requests and service workflows into one connected journey."],["Appointment visibility","Help patients understand their upcoming diagnostic steps."],["Report delivery","Keep results accessible alongside the patient’s health history."],["Care continuity","Support a smoother handoff from diagnostics to follow-up."]]}/>;}
