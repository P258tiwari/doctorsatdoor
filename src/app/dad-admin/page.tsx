import { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("DAD Admin (coming soon)","Planned software that helps clinic teams manage daily work, from check-ins to follow-ups.","/dad-admin");
export default function Page(){return <ProductLanding name="Admin" headline="More care. Less admin." description="Planned software that helps clinic teams manage daily work, from check-ins to follow-ups." photo="collaboration" type="clinic" features={[["Clinic coordination","See check-ins, queues, and daily tasks in one view."],["Patient-shared reports","View a patient’s relevant reports when the patient shares them."],["Follow-up requests","Help teams manage follow-up requests and keep next steps visible."],["Lab connections","Connect clinic work with labs and diagnostic centres."]]}/>;}
