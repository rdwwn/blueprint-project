import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, BookOpen, Check } from "lucide-react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

type Resource = {
  title: string;
  category: string;
  intro: string;
  sections: { heading: string; body: string[]; tip?: string }[];
  checklist: string[];
};

const RESOURCES: Record<string, Resource> = {
  "essay-writing": {
    title: "Essay Writing",
    category: "Applications",
    intro: "How to write a personal statement that admissions officers actually remember.",
    sections: [
      {
        heading: "Start with a moment, not a topic",
        body: [
          "Don't brainstorm 'what should I write about.' Instead, brainstorm a moment. A specific scene you can see in your head. The moment your hand cramped during a piano recital. The day you realized your dad's job was more complicated than you thought.",
          "The topic is what you write about. The moment is how you write about it. Admissions officers read 50 essays a day. The moment is what they'll remember.",
        ],
        tip: "If you can't see the scene, you don't have an essay yet. Keep brainstorming.",
      },
      {
        heading: "Show, don't tell",
        body: [
          "Telling: 'I am passionate about computer science and love solving hard problems.'",
          "Showing: 'It was 3am and the only light in the apartment was the laptop glow. I had been stuck on this bug for six hours. I had eaten two granola bars. I had not brushed my teeth. But I had figured out why the recursion wasn't terminating.'",
          "Which one sounds more like a person? The second one. That's showing.",
        ],
      },
      {
        heading: "End with a question",
        body: [
          "The best essays don't tie up neatly. They leave a question open. The reader keeps thinking. That's the goal.",
          "Don't end with 'I am excited to study X in college.' End with something that opens outward: a thought, an observation, a small surprise.",
        ],
      },
      {
        heading: "Read it out loud",
        body: [
          "If you stumble when reading, the writing is bad. Rewrite until it flows naturally when spoken.",
          "Have someone else read it who doesn't know you well. If they can summarize your essay in one sentence, you have a story. If they can't, you don't yet.",
        ],
      },
    ],
    checklist: [
      "Started with a specific scene, not a topic",
      "Used sensory details (smells, sounds, sights)",
      "Showed rather than told throughout",
      "Ended with an open question, not a conclusion",
      "Read it out loud and didn't stumble",
      "Had a stranger read it and they could summarize it",
      "Cut my first paragraph",
      "Checked the word count and stayed under the limit",
    ],
  },
  "interview-prep": {
    title: "Interview Prep",
    category: "Applications",
    intro: "Common questions, what to ask back, and how to handle the nerves.",
    sections: [
      {
        heading: "The questions you'll be asked",
        body: [
          "Most interviews hit a small set of predictable questions. 'Tell me about yourself' (not your life story, your hook). 'Why are you interested in X?' (specific reason, not generic). 'Tell me about a challenge' (one real story, what you learned).",
          "Prepare 2-3 stories you can adapt. A leadership story. A failure story. A curiosity story. Practice saying them in 90 seconds.",
        ],
        tip: "Specific beats impressive. 'I led the debate team to states' is less memorable than 'I lost the first three rounds, switched my approach, and came back to win the next three.'",
      },
      {
        heading: "What to ask them",
        body: [
          "Always have 2-3 questions. 'What does a typical day look like?' 'What's the most challenging part of this role?' 'How do you measure success in this position?' 'What do you enjoy most about working here?'",
          "Questions about the work are better than questions about perks. Don't ask about hours, vacation, or salary in a first interview.",
        ],
      },
      {
        heading: "Handling nerves",
        body: [
          "Your hands will shake. Your voice will crack. This is normal and expected. Interviewers don't expect perfection. They expect authenticity.",
          "Do a mock interview with a friend. Practice the awkward silences. Practice saying 'I don't know, but here's how I'd figure it out.'",
        ],
      },
    ],
    checklist: [
      "Researched the company/program thoroughly",
      "Prepared 2-3 adaptable stories",
      "Practiced 'Tell me about yourself' (60 seconds)",
      "Have 3 questions to ask them",
      "Done at least one mock interview",
      "Know the interviewer's name and role",
      "Tested my tech if it's virtual",
    ],
  },
  "resume-building": {
    title: "Resume Building",
    category: "Applications",
    intro: "What goes on a high school resume, what doesn't, and how to format it.",
    sections: [
      {
        heading: "Keep it to one page",
        body: [
          "High school resumes are one page. Always. If you have so much to list that you need two pages, you don't have a resume problem. You have an editing problem.",
          "The exception: applying to specialized programs that ask for a CV. But for college and most opportunities, one page.",
        ],
      },
      {
        heading: "Lead with action verbs",
        body: [
          "'Led, built, designed, organized, researched, published, founded, won, increased, decreased, presented, taught.'",
          "Not 'responsible for' or 'helped with.' You did things. Say what you did.",
        ],
      },
      {
        heading: "Quantify when possible",
        body: [
          "'Organized a school-wide food drive' is fine. 'Organized a school-wide food drive that collected 800 pounds of food for the local shelter' is better. Numbers are specific. Specific is memorable.",
        ],
      },
    ],
    checklist: [
      "One page only",
      "Contact info at top",
      "Action verbs throughout",
      "Quantified achievements where possible",
      "No typos or grammar issues",
      "Consistent formatting (font, sizes, spacing)",
      "Tailored to the specific opportunity",
    ],
  },
  "research-skills": {
    title: "Research Skills",
    category: "Skill Building",
    intro: "How to find a research opportunity, write a cold email, and actually contribute.",
    sections: [
      {
        heading: "Start local",
        body: [
          "You don't need to get into RSI to do research. Start with your local community college or state university. Most professors are happy to have a motivated high schooler volunteer in their lab.",
          "Email 10 professors. Expect 7 to ignore you, 2 to politely decline, 1 to say yes. That 1 is your entry point.",
        ],
      },
      {
        heading: "Read before you email",
        body: [
          "Before you email a professor, read one of their recent papers. Mention something specific about it in your email. This is the difference between 'I want to do research' and 'I read your 2023 paper on X and I'd love to learn more about the methodology you used.'",
        ],
      },
      {
        heading: "Show up and do the work",
        body: [
          "Once you're in, the work is real. You'll be doing grunt work at first (literature reviews, data cleaning, organizing references). This is normal. Be reliable. Be curious. Ask good questions. The interesting work comes once you've proven you can handle the boring work.",
        ],
      },
    ],
    checklist: [
      "Identified 10 potential professors in my area",
      "Read at least one paper from each before emailing",
      "Wrote personalized emails (not a mass template)",
      "Attached a one-page resume",
      "Followed up after one week if no response",
      "Prepared for a screening call or interview",
    ],
  },
  "finding-mentors": {
    title: "Finding Mentors",
    category: "Networking",
    intro: "How to identify, approach, and build relationships with adults who will advocate for you.",
    sections: [
      {
        heading: "Mentors come from everywhere",
        body: [
          "Your high school teacher. A neighbor who is an engineer. A parent's colleague. A professor from a summer program. A coach. A boss from a part-time job.",
          "The best mentors aren't the most impressive. They're the ones who actually have time for you and care about your growth.",
        ],
      },
      {
        heading: "Be a good mentee",
        body: [
          "Show up on time. Do what you say you'll do. Ask thoughtful questions. Don't be defensive about feedback. Send thank-you notes. Be the kind of person a mentor wants to help.",
        ],
      },
    ],
    checklist: [
      "Identified 3-5 potential mentors",
      "Approached one with a specific ask",
      "Sent a thank-you note after every meeting",
      "Followed up on every commitment",
      "Asked for help when I needed it",
    ],
  },
  "cold-emailing": {
    title: "Cold Emailing",
    category: "Networking",
    intro: "Templates and examples for reaching out to professors, alumni, and professionals.",
    sections: [
      {
        heading: "The structure that works",
        body: [
          "Subject line: specific and short ('High schooler interested in your research on X')",
          "Paragraph 1: who you are and why you're emailing (2 sentences max)",
          "Paragraph 2: what specifically interests you about their work (1 specific detail, not generic)",
          "Paragraph 3: what you're asking for (15-minute call, lab tour, advice on next steps)",
          "Sign off: thank them for their time",
        ],
      },
      {
        heading: "Templates",
        body: [
          "Template for a professor: 'Hi Dr. X, I'm a junior at Y High School. I'm interested in [field] and read your paper on [specific thing]. I'd love to learn more about your research and how I might get involved. Would you have 15 minutes for a call or coffee? Thank you for your time.'",
          "That's it. 4 sentences. No life story. No flattery. Specific ask.",
        ],
      },
    ],
    checklist: [
      "Subject line is specific",
      "First paragraph is under 2 sentences",
      "Mentioned something specific about their work",
      "Asked for something specific (15-min call, not a job)",
      "Under 200 words total",
      "No typos",
    ],
  },
  "time-management": {
    title: "Time Management",
    category: "Skill Building",
    intro: "Calendars, systems, and habits that work for busy students.",
    sections: [
      {
        heading: "Pick one system",
        body: [
          "Google Calendar, Notion, paper planner, sticky notes. Doesn't matter. Pick one. Use it for two weeks. If it works, keep it. If not, try another.",
          "The mistake is bouncing between systems. Pick one and commit.",
        ],
      },
      {
        heading: "Time block, don't task list",
        body: [
          "Task lists are anxiety-producing. Time blocks are action-producing.",
          "Instead of 'study for SAT,' put 'SAT practice test, 2pm-4pm' on your calendar. Now it's a commitment, not a wish.",
        ],
      },
      {
        heading: "Plan tomorrow tonight",
        body: [
          "Every night before bed, spend 5 minutes planning tomorrow. What's the most important thing? When will I do it? What could derail me?",
          "This is the single most useful habit for busy students.",
        ],
      },
    ],
    checklist: [
      "Have one calendar system I use consistently",
      "Block time for important tasks, not just add to a list",
      "Plan tomorrow the night before",
      "Review my week every Sunday",
      "Built in buffer time for unexpected stuff",
    ],
  },
  "standing-out": {
    title: "Standing Out",
    category: "Strategy",
    intro: "How to develop a narrative admissions officers remember.",
    sections: [
      {
        heading: "Have a spike",
        body: [
          "Most applicants are well-rounded. Nobody remembers well-rounded. Admissions officers remember the kid who built a solar-powered boat. Or won a national debate tournament. Or published a paper on antimicrobial resistance at 17.",
          "A spike is one thing you're genuinely exceptional at. Not three things you're good at. One thing you're great at.",
        ],
      },
      {
        heading: "Be authentic",
        body: [
          "The spike has to be real. Admissions officers can tell when someone's spike was manufactured for the application. Your spike should be something you'd do even if no one was watching.",
        ],
      },
    ],
    checklist: [
      "Identified my spike (one thing I'm genuinely great at)",
      "Built a narrative around it across my application",
      "Every activity and award connects to my story",
      "I'm not trying to be someone I'm not",
    ],
  },
};

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.keys(RESOURCES).map((slug) => ({ slug }));
}

export default async function ResourcePage({ params }: Params) {
  const { slug } = await params;
  const r = RESOURCES[slug];
  if (!r) notFound();

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <article className="mx-auto max-w-3xl px-6 pb-20">
          <Link href="/resources" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to resources
          </Link>
          <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              <BookOpen className="h-3 w-3" /> {r.category}
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{r.title}</h1>
          <p className="mt-3 text-lg text-muted-foreground">{r.intro}</p>

          <div className="mt-10 space-y-8">
            {r.sections.map((s) => (
              <section key={s.heading}>
                <h2 className="text-2xl font-semibold">{s.heading}</h2>
                <div className="mt-3 space-y-3 text-base leading-relaxed text-foreground/85">
                  {s.body.map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
                {s.tip && (
                  <div className="mt-4 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-foreground">
                    <span className="font-semibold text-accent">Tip: </span>
                    {s.tip}
                  </div>
                )}
              </section>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold">Quick checklist</h2>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {r.checklist.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-background">
                    <Check className="h-3 w-3 text-primary" />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
