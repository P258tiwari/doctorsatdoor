import Link from "next/link";
import { ArrowUpRight, FolderHeart, MessagesSquare, UsersRound } from "lucide-react";
import "./HowItWorksSection.css";

const moments = [
  {
    icon: UsersRound,
    context: "FOR YOUR FAMILY",
    title: "Keep family records separate.",
    description: "Add a family member, upload their reports, and switch profiles to view them.",
    tools: "Family profiles / Switch profile",
  },
  {
    icon: FolderHeart,
    context: "FOR YOUR NEXT VISIT",
    title: "Find the reports you need.",
    description: "View reports by date, create folders, and combine reports into one PDF for your doctor.",
    tools: "Timeline / Folders / Combined PDF",
  },
  {
    icon: MessagesSquare,
    context: "FOR YOUR QUESTIONS",
    title: "Understand more. Follow up easily.",
    description: "Read AI summaries, request a paid AI video explanation, or send your doctor a follow-up request.",
    tools: "AI summaries / AI video explanations / Follow-up requests",
  },
];

export function HowItWorksSection() {
  return (
    <section className="dad-section care-moments" aria-labelledby="care-moments-title">
      <div className="dad-container care-moments-layout">
        <div className="care-moments-intro">
          <span className="eyebrow">BUILT AROUND REAL LIFE</span>
          <h2 id="care-moments-title">Care continues.<br /><em>Between visits, too.</em></h2>
          <p>The appointment is only part of the story. DAD Report helps you manage the reports and questions you take home.</p>
          <Link href="/dad-report" className="text-link">Get to know DAD Report <ArrowUpRight size={18} /></Link>
          <div className="care-moments-note"><span aria-hidden="true" />Available in DAD Report today</div>
        </div>
        <div className="care-moments-stories">
          {moments.map(({ icon: Icon, context, title, description, tools }) => (
            <article className="care-moment" key={title}>
              <div className="care-moment-icon"><Icon size={23} strokeWidth={1.5} aria-hidden="true" /></div>
              <div>
                <span className="care-moment-context">{context}</span>
                <h3>{title}</h3>
                <p>{description}</p>
                <div className="care-moment-tools">{tools}</div>
              </div>
            </article>
          ))}
          <p className="care-moments-disclaimer">AI explanations help you understand your reports. For medical advice, talk to your doctor.</p>
        </div>
      </div>
    </section>
  );
}
