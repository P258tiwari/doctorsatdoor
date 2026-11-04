import { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("DAD Admin (Coming Soon)","A future workspace for clinics to coordinate daily operations around the patient journey.","/dad-admin");
export default function Page(){return <ProductLanding name="Admin" headline="More care. Less admin." description="A future workspace for clinics to coordinate daily operations around the patient journey." photo="collaboration" type="clinic" features={[["Clinic coordination","A clearer overview of check-ins, queues, and care workflows."],["Patient-authorised history","Bring relevant records into view with the patient’s permission."],["Follow-up workflows","Help teams coordinate requests and keep next steps visible."],["Lab connections","Connect clinic workflows with the wider diagnostic journey."]]}/>;}
