import Link from "next/link";
import { ArrowUpRight, FolderHeart, MessagesSquare, UsersRound } from "lucide-react";
import "./HowItWorksSection.css";

const moments = [
  {
    icon: UsersRound,
    context: "FOR YOUR FAMILY",
    title: "Keep family records separate.",
    description: "Add family profiles, upload their reports, and switch between records easily.",
    tools: "Family profiles / Shared access",
  },
  {
    icon: FolderHeart,
    context: "FOR YOUR NEXT VISIT",
    title: "Find the reports you need.",
    description: "Group reports by treatment, view them by date, and share them with your doctor.",
    tools: "AI sorting / Treatment folders / Sharing",
  },
  {
    icon: MessagesSquare,
    context: "FOR YOUR QUESTIONS",
    title: "Understand more. Follow up easily.",
    description: "Read AI summaries, watch explanations, or request follow-up by voice.",
    tools: "AI summaries / Video explanations / Voice requests",
  },
];

export function HowItWorksSection() {
  return (
    <section className="dad-section care-moments" aria-labelledby="care-moments-title">
      <div className="dad-container care-moments-layout">
        <div className="care-moments-intro">
          <span className="eyebrow">BUILT AROUND REAL LIFE</span>
          <h2 id="care-moments-title">Care continues.<br /><em>Between visits, too.</em></h2>
          <p>The appointment is only part of the story. DAD Report helps with the details that patients and families carry home.</p>
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
          <p className="care-moments-disclaimer">AI explanations support understanding. Your doctor remains the person to turn to for medical advice.</p>
        </div>
      </div>
    </section>
  );
}
