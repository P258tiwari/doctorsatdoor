import { Metadata } from "next";
import { ProductLanding } from "@/components/ProductLanding";
import { pageMetadata } from "@/lib/seo";
export const metadata:Metadata=pageMetadata("DAD Lab (Coming Soon)","Connecting laboratory workflows, reports, and the people who need them.","/dad-lab");
export default function Page(){return <ProductLanding name="Lab" headline="Every result matters." description="Connecting laboratory workflows, reports, and the people who need them." photo="laboratory" type="diagnostic" features={[["Connected reports","A planned bridge between laboratory systems and patient records."],["Sample tracking","More visibility across the journey from sample to result."],["Care team coordination","Help laboratories and clinicians stay aligned."],["Patient continuity","Keep the result connected to the wider health story."]]}/>;}
