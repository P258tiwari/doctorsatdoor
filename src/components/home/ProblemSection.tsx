import Link from "next/link";
import { ArrowUpRight, Files, Clock, CalendarClock, Route, House, Wallet, Globe, Network } from "lucide-react";
import { CarePhoto } from "@/components/Visuals";
import "./ProblemSection.css";

const problems = [
  { Icon: Clock, title: "Long waits.\nRepeated visits.", text: "Waiting and repeat visits add stress for patients and take time and attention from the family members supporting them." },
  { Icon: CalendarClock, title: "Limited time.\nDelayed answers.", text: "Busy clinics and short consultations can leave questions unanswered and delay follow-up." },
  { Icon: Network, title: "Local services.\nDisconnected care.", text: "Clinics, hospitals, labs, and pharmacies often work separately, so patients have to coordinate between them." },
  { Icon: Files, title: "Scattered records.\nAn incomplete history.", text: "When reports are spread across papers and providers, it is hard to find, track, and share your health history." },
  { Icon: House, title: "Everyday care.\nStill out of reach.", text: "Travelling for basic tests and healthcare can be exhausting, especially when suitable care closer to home is hard to arrange." },
  { Icon: Route, title: "Long journeys.\nMore time away.", text: "Trips between clinics, labs and hospitals for consultations, tests and follow-ups take time and energy away from daily life." },
  { Icon: Wallet, title: "Repeated steps.\nAvoidable expenses.", text: "Repeat visits, duplicate tests, and travel add costs when records and services are not connected." },
  { Icon: Globe, title: "Specialist care.\nHarder to reach.", text: "Disconnected referral systems make it harder to reach the right specialist or get a second opinion in another city or country." },
];

export function ProblemSection() {
  return <section className="dad-section home-problem" aria-labelledby="home-problem-title"><div className="dad-container">
    <header className="problem-introduction"><div><span className="eyebrow">WHY DOCTORS AT DOOR EXISTS</span><h2 id="home-problem-title">Healthcare is fragmented.<br/><em>You feel the gaps.</em></h2></div><p>Good care is more than a consultation. You also need to know where your reports are, who to contact, and what happens next. You should not have to manage all of that alone.</p></header>
    <div className="problem-story"><div className="problem-story-photo"><CarePhoto src="problem-chasing-reports" alt="A daughter calls to chase a missing diagnostic report while her father reviews scattered medical paperwork at home"/></div><div className="problem-story-copy"><span className="eyebrow">A FAMILIAR MOMENT</span><h3>The test is done.<br/><em>The chasing begins.</em></h3><p>You leave with a simple plan: collect the report and return to the doctor. Then come the calls, messages, missing files and questions about the next step.</p><p className="problem-story-emphasis"><span className="problem-story-quote" aria-hidden="true">“</span>The patient’s journey continues.<br/>The information doesn’t always follow.</p></div></div>
    <div className="problem-reasons">{problems.map(({ Icon, title, text }, i) => <article key={title}><div className="problem-reason-top"><span className="problem-reason-icon"><Icon size={21} aria-hidden="true"/></span><span className="problem-reason-number">0{i + 1}</span></div><h3>{title.split("\n").map(line => <span key={line}>{line}</span>)}</h3><p>{text}</p></article>)}</div>
    <div className="problem-dad-response"><div className="problem-response-intro"><span className="eyebrow">THIS IS WHERE DAD COMES IN</span><h3>Less chasing.<br/><em>More continuity.</em></h3></div><div className="problem-response-copy"><p>Your care should move forward without starting over each time. DAD is building a platform that brings your health history and care providers closer together. It starts with <strong>DAD Report</strong>: upload your reports, read AI summaries, and add family members, so the right information is ready to share.</p><p>Connections with clinics, labs, and other care providers will follow in phases.</p><Link href="/dad-report" className="text-link">See DAD Report in action<ArrowUpRight size={16}/></Link></div></div>
  </div></section>;
}
