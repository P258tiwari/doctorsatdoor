import { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("DAD Lab (coming soon)","Planned software that connects labs, their reports, and the people who need them.","/dad-lab");
export default function Page(){return <ProductLanding name="Lab" headline="Every result matters." description="Planned software that connects labs, their reports, and the people who need them." photo="laboratory" type="diagnostic" features={[["Connected reports","Send lab reports straight to the patient’s records."],["Sample tracking","Track each sample from collection to result."],["Care team coordination","Help labs and doctors stay in step."],["Patient history","Keep each result with the patient’s other reports."]]}/>;}
