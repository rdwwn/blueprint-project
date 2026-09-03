"use client";

import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Check, Calendar, Clock, Link2 } from "lucide-react";
import { useState } from "react";
import { ScrollProgress } from "@/components/scroll-progress";
import { AnimatedNav } from "@/components/animated-nav";
import { Footer } from "@/components/footer";

const RELATED_LINKS: Record<string, { label: string; href: string }[]> = {
  "when-to-start-college-apps": [
    { label: "Browse college admissions programs", href: "/opportunities?cat=College%20Admissions" },
    { label: "All summer programs for high schoolers", href: "/opportunities?cat=Summer%20Program" },
    { label: "Research opportunities", href: "/opportunities?cat=Research" },
  ],
  "summer-programs-worth-it": [
    { label: "Summer programs", href: "/opportunities?cat=Summer%20Program" },
    { label: "Free programs", href: "/opportunities?cost=free" },
    { label: "All programs in CS & Engineering", href: "/opportunities?field=CS%20%26%20Engineering" },
  ],
  "essay-tips-that-work": [
    { label: "All application strategy programs", href: "/opportunities" },
    { label: "Free programs", href: "/opportunities?cost=free" },
  ],
  "scholarship-hunting-strategy": [
    { label: "Browse all scholarships", href: "/opportunities?cat=Scholarship" },
    { label: "Free programs", href: "/opportunities?cost=free" },
    { label: "No-essay scholarships", href: "/opportunities?scholarshipType=no-essay" },
  ],
  "balancing-school-year-opportunities": [
    { label: "School-year programs", href: "/opportunities?season=school" },
    { label: "Part-time internships", href: "/opportunities?cat=Internship" },
  ],
  "research-vs-internship": [
    { label: "Research programs", href: "/opportunities?cat=Research" },
    { label: "Internship programs", href: "/opportunities?cat=Internship" },
    { label: "All summer programs", href: "/opportunities?cat=Summer%20Program" },
  ],
  "how-to-cold-email-a-professor": [
    { label: "Research programs", href: "/opportunities?cat=Research" },
    { label: "All programs in CS & Engineering", href: "/opportunities?field=CS%20%26%20Engineering" },
    { label: "All programs in Medicine & Health", href: "/opportunities?field=Medicine%20%26%20Health" },
  ],
  "what-admissions-officers-look-for": [
    { label: "All programs", href: "/opportunities" },
    { label: "Free programs", href: "/opportunities?cost=free" },
    { label: "College admissions filter", href: "/opportunities?cat=College%20Admissions" },
  ],
  "building-a-spike": [
    { label: "Internship programs", href: "/opportunities?cat=Internship" },
    { label: "Research programs", href: "/opportunities?cat=Research" },
    { label: "All competitions", href: "/opportunities?cat=Competition" },
  ],
  "first-gen-student-guide": [
    { label: "Free programs", href: "/opportunities?cost=free" },
    { label: "Scholarships", href: "/opportunities?cat=Scholarship" },
    { label: "All programs", href: "/opportunities" },
  ],
};

export const POSTS: Record<string, { title: string; category: string; readTime: number; date: string; cover: string; content: string[] }> = {
  "when-to-start-college-apps": {
    title: "When should you actually start your college applications?",
    category: "College Admissions",
    readTime: 7,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1499914485622-a88fac536970?auto=format&fit=crop&w=1600&q=70",
    content: [
      "The most common mistake students make is treating college applications as a senior year project. They aren't. The habits, experiences, and positioning that get you into a great school start freshman year.",
      "Here's a realistic, year-by-year timeline based on what actually moves the needle for admissions officers.",
      "Freshman year is about exploration and academics. Take the hardest classes you can handle while keeping your grades high. Try one or two activities that genuinely interest you. The point isn't to build a resume yet. It's to figure out what you care about.",
      "Sophomore year is when you start to specialize. By now you should have one or two activities you genuinely love. Lean into those. Look for leadership opportunities. Consider your first serious summer program or research experience.",
      "Junior year is the most important year academically. It's the last full year of grades admissions will see. Take SAT/ACT. Build relationships with two or three teachers who can write strong recommendation letters. Apply to competitive summer programs.",
      "Summer before senior year is critical. Most selective summer programs (RSI, MITES, COSMOS, etc.) happen between junior and senior year. This is also when you should be drafting your college essay and Common App activities list.",
      "Senior year fall is execution. You already know your schools. Submit Early Action/Early Decision if you have a clear top choice. Keep your grades up. The single biggest mistake at this point is a senior year slump that gets you rescinded.",
      "The takeaway: there is no single moment to start. There's a four-year arc. The students who get into top schools aren't smarter. They started earlier and stayed consistent.",
    ],
  },
  "summer-programs-worth-it": {
    title: "Are summer programs actually worth it? An honest breakdown",
    category: "Summer Planning",
    readTime: 9,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1600&q=70",
    content: [
      "Every summer, the same question comes up: are these programs actually worth the time, effort, and sometimes money?",
      "The honest answer: it depends on the program and what you do with it. Here's how to think about it.",
      "Tier 1: Highly selective, free programs. RSI, MOSTEC, COSMOS, MITES, Simons Summer Research. If you can get into one of these, yes. They signal academic seriousness to admissions. They give you access to research you couldn't do on your own. They're also free or heavily subsidized, so the financial risk is zero.",
      "Tier 2: Selective programs with cost. Brown's Pre-College, Stanford Summer Session, Yale Young Global Scholars. These are good but expensive. The admissions signal is moderate. The real value is what you do during the program (a project, a paper, a network).",
      "Tier 3: Generic summer programs. Many universities run paid summer programs that are essentially for-credit courses. These are usually not worth the cost for admissions purposes. You'd learn more by reading the same material independently or doing a project.",
      "Free alternatives that work. Reach out to professors at local universities and ask to volunteer in their lab. Start a research project on your own. Build something. Write something. The admissions signal is similar to a Tier 2 program, often stronger.",
      "The biggest mistake: doing a summer program for the resume line without engaging with it. Admissions officers can tell. They want to hear what you learned, what you built, what changed. If you can't talk about it in an essay, the program didn't help you.",
      "Bottom line: pick programs that align with what you actually care about. The best program is the one that lets you do something you couldn't do on your own, and that gives you stories to tell.",
    ],
  },
  "essay-tips-that-work": {
    title: "College essay tips that actually worked for accepted students",
    category: "Application Strategy",
    readTime: 11,
    date: "Jul 2026",
    cover: "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1600&q=70",
    content: [
      "I've read hundreds of college essays from students who got into top schools. The patterns are clear.",
      "The good ones aren't about impressive accomplishments. They're about specific moments, real observations, and a shift in how the writer sees the world.",
      "Tip 1: Start with a scene, not a thesis. Don't open with 'I have always been passionate about science.' Open with a moment: a lab bench at 11pm, a particular smell, a specific thing your grandfather said. Show, don't tell.",
      "Tip 2: Be specific in a way that only you can be. Anyone can write about wanting to help people. Only you can write about the exact moment you realized your grandmother's hands moved differently when she was tired.",
      "Tip 3: End with a question, not an answer. The best essays leave the reader with a thought to chew on, not a conclusion that's been tied up neatly. Admissions officers read 50 essays a day. Give them something to keep thinking about.",
      "Tip 4: Cut your first paragraph. Almost every draft has a throwaway intro. Cut it. Start with paragraph two.",
      "Tip 5: Read it out loud. If you stumble, the writing is bad. Rewrite until it flows.",
      "Tip 6: Don't try to be impressive. Be honest. The students who get in aren't the ones with the most impressive stories. They're the ones who tell their stories most honestly.",
      "The biggest mistake: writing what you think admissions wants to hear. They want to hear you. They want to know who you actually are, not who you think they want.",
    ],
  },
  "scholarship-hunting-strategy": {
    title: "The scholarship hunting strategy nobody talks about",
    category: "Scholarships",
    readTime: 8,
    date: "Jul 2026",
    cover: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600&q=70",
    content: [
      "The big scholarship databases (Fastweb, Scholarships.com, etc.) are fine. But they list the same scholarships everyone else applies to. The real money is elsewhere.",
      "Strategy 1: Local scholarships. Rotary clubs, Lions clubs, Elks lodges, women's clubs, local businesses, community foundations. The applicant pool is much smaller. Win rates are 10x higher than national scholarships.",
      "Strategy 2: Company scholarships. Most large companies have scholarship programs for children of employees, students in their community, or students going into their field. Search '[company name] scholarship'.",
      "Strategy 3: Niche identity scholarships. If you are a specific type of person (left-handed, tall, vegan, part of a specific cultural group), there is a scholarship for you. These are real, and they have very small applicant pools.",
      "Strategy 4: Major-specific scholarships. Most professional associations give scholarships to students going into their field. The American Chemical Society, the Society of Women Engineers, the National Press Foundation. Search '[your field] scholarship'.",
      "Strategy 5: Apply to less popular national scholarships. The Coca-Cola Scholars program gets 100,000 applications. The smaller ones get 5,000. Your odds are 20x better.",
      "Strategy 6: Reusable essays. Most scholarship essays are about your goals, your community, or a challenge you've overcome. Write three great personal essays. Adapt them to each application.",
      "The math: a student who applies to 30 local scholarships at 20% win rate gets 6 wins. Average $2,000 each. That's $12,000. Apply to that many and you're looking at a meaningful chunk of college costs.",
    ],
  },
  "balancing-school-year-opportunities": {
    title: "Balancing school-year opportunities without burning out",
    category: "Student Life",
    readTime: 6,
    date: "Jul 2026",
    cover: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=1600&q=70",
    content: [
      "High schoolers are busier than ever. Research, internships, clubs, sports, music, volunteering, jobs. Something has to give.",
      "The question isn't whether you can do all of it. You probably can, briefly. The question is whether doing all of it is worth what it costs.",
      "Rule 1: Pick one anchor activity. The thing you do more than anything else, the thing you'd do even if it didn't help your resume. This is your anchor. Build everything else around it.",
      "Rule 2: Cap your commitments. A realistic cap: 2-3 activities plus school plus one structured opportunity (research, internship, job). If you have more than that, drop something. Quality beats quantity.",
      "Rule 3: Drop things on purpose. Every semester, drop one activity. Make room for something new. Or just make room for sleep.",
      "Rule 4: Protect your mornings. The students who get the most done wake up early. The students who burn out stay up late. Sleep is not optional.",
      "Rule 5: Use weekends strategically. One weekend day for rest. One for a deep work block on a project that matters to you. The projects that build your resume are the ones you do in focused chunks.",
      "Rule 6: Tell people no. This is the hardest one. Saying yes to everything is how you end up doing nothing well. Saying no to the right things frees you up to say yes to the things that actually matter.",
    ],
  },
  "research-vs-internship": {
    title: "Research vs internship: which is right for you?",
    category: "Application Strategy",
    readTime: 7,
    date: "Jun 2026",
    cover: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1600&q=70",
    content: [
      "Both research and internships are great for college applications. But they build different skills, lead to different outcomes, and fit different students.",
      "Research is for students who love deep work. You spend 6-10 weeks on a single question. You read papers, run experiments, write a report. The output is knowledge. The skill you build is figuring things out.",
      "Internships are for students who like working with people. You spend 6-10 weeks on a team, contributing to a product or project. The output is a finished thing. The skill you build is collaboration and execution.",
      "Which one is right for you depends on three things.",
      "What do you want to study in college? If you want to study science, engineering, or math, research is the better signal. If you want to study business, CS applied, or social science, internships are equally valued.",
      "What's your work style? Research rewards patience and independence. Internships reward communication and adaptability. Both are valuable. Pick the one that matches how you work.",
      "What's available to you? Don't idealize. The best opportunity is the one you can actually get. A mediocre internship at a known company beats a great research project you can't access.",
      "Can you do both? Yes, but not in the same summer. If you have two summers before senior year, do research one summer and an internship the other. You'll have stories from both worlds.",
      "The bottom line: don't pick research because you think it's more impressive. Pick the one you'll learn the most from and be able to talk about in an essay.",
    ],
  },
  "how-to-cold-email-a-professor": {
    title: "How to cold-email a professor (with 4 real templates that work)",
    category: "Application Strategy",
    readTime: 8,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1600&q=70",
    content: [
      "Most high schoolers never email a professor. The ones who do get research positions, recommendation letters, and advice that nobody else gets. The barrier is not talent. It's knowing what to say.",
      "Here are four real templates that have worked. Use them as starting points, not scripts. Personalize the bracketed parts.",
      "Template 1: Asking for a research position. Subject: High school junior interested in [their field]. Hi Professor [Name], I'm a junior at [School] and I'm interested in [their specific research area, named from a paper they published]. I'd love to learn more about how you got into this work and whether you'd be open to me volunteering in your lab this summer. I can work [X hours/week] and would be happy to start with whatever you need. Thank you for your time.",
      "Template 2: Asking for advice (less commitment). Subject: Quick question about [field] from a high schooler. Hi Professor [Name], I'm a high school student interested in [their field]. I read your paper on [topic] and had one question: [specific, thoughtful question]. If you have 5 minutes to reply, I'd really appreciate it. Thank you.",
      "Template 3: Following up after no response. Subject: Re: [original subject]. Hi Professor [Name], I emailed you [X weeks] ago about [topic]. No pressure at all if you're too busy. If you have a moment to point me in the right direction, I'd really appreciate it. If not, I understand completely. Thanks.",
      "Template 4: Thank you after they help. Subject: Thank you. Hi Professor [Name], I just wanted to say thank you for [specific thing they did]. It made a real difference. [One sentence about what you did with their advice.] I hope to stay in touch as I keep going. Thanks again.",
      "Three rules. First, make it short. Under 200 words. Second, make it specific. Reference their actual work. Third, make it easy. Suggest a small commitment, not a big one. Most professors get 50 emails a week from strangers. Yours needs to feel different in 10 seconds.",
    ],
  },
  "what-admissions-officers-look-for": {
    title: "What admissions officers actually look for in your application",
    category: "College Admissions",
    readTime: 10,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=1600&q=70",
    content: [
      "I sat down with three admissions officers from selective schools. Here's what they actually look for, in their own words, plus what they say is overrated.",
      "Factor 1: Academic readiness. This is non-negotiable. Your grades and course rigor (honors, AP, IB) need to put you in the middle 50% of admitted students. Below that, everything else is a long shot. Above that, the rest of your application starts to matter.",
      "Factor 2: A clear spike. The applicants who get in have one thing they are genuinely great at. Not five things they are good at. A spike is what you would do even if no one was watching. It should show up across your application: your course choices, your activities, your essay, your recommendation letters.",
      "Factor 3: Context and character. Admissions officers read thousands of applications. They remember the ones where they understood the person. Your essay, your short answers, and your recommendation letters should give them a real sense of who you are. Not what you think they want to hear.",
      "Factor 4: Fit. Every school has a vibe. Yale loves people who would thrive in residential colleges. MIT loves people who built something. Pomona loves people who read. The application should show why you and the school are a good match, not why you're a good student in general.",
      "Factor 5: Contribution. What will you add to the campus? This is different from achievement. It's about what you'll bring to the dorm, the lab, the club, the team. The officer is trying to imagine you in their community.",
      "What's overrated: perfection. A 4.0, 1600 SAT, 12 AP classes, 5 clubs, and a polished essay is a stronger application than a 3.7, 1500, 6 APs, 2 deep activities, and an authentic essay. The story beats the stats.",
      "What's overrated: number of activities. Depth beats breadth every time. Three activities you genuinely care about beat ten activities you joined for the resume.",
      "What's underrated: explaining a failure. Most students hide their failures. The applicants who write about what they learned from a C in chemistry, a failed club initiative, or a rejection, and what they did differently after, stand out. Admissions officers are people. They relate to that.",
    ],
  },
  "building-a-spike": {
    title: "Building a spike: the one thing that makes your application memorable",
    category: "Application Strategy",
    readTime: 9,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=70",
    content: [
      "Forget well-rounded. The students who get into top schools are spiky. They have one thing they are great at, not ten things they are good at. Here's how to find and develop yours.",
      "What is a spike? A spike is one thing you are exceptionally good at. It's narrow, deep, and visible. It's not what you do. It's what you do better than most other people. It can be a sport, a subject, a skill, a project, a cause. It should be something you would keep doing even if no one was paying attention.",
      "Why spikes work. Admissions officers read 30,000 applications a year. They remember the kid who built a satellite tracker and presented it at a state science fair, not the kid who was in 8 clubs and got A's in everything. Spikes make you memorable. They give your application a story. They show what you would contribute to campus.",
      "How to find your spike. The most common mistake is picking a spike that looks impressive. The best spikes come from genuine interest. Ask yourself three questions. What do I do for hours without getting bored? What do I know more about than my friends? What would I do even if no one was watching?",
      "Once you have a candidate spike, the next step is to go deep. A spike at 16 looks like a passion. A spike at 18 looks like an expert. Depth comes from sustained effort: a project, a publication, a leadership role, a competition, an independent study. Pick one direction and go.",
      "What if you have multiple interests? Pick the one that lights you up the most. You can be a polymath in college. For the application, pick one.",
      "What if your spike isn't traditional? Traditional spikes: debate captain, varsity captain, research publication, math olympiad, nonprofit founder. Non-traditional spikes: competitive Rubik's cube, vintage typewriter repair, ramen blog with 100k followers, urban beekeeping. Admissions officers love non-traditional. They show character and curiosity. As long as you've done it seriously, it counts.",
      "How to demonstrate your spike across the application. Your course choices should reflect it. Your activities list should center it. Your essay should tell a story about it. Your recommendation letters should mention it. Every part of your application should be coherent: this is who I am, and this is what I'm exceptional at.",
    ],
  },
  "first-gen-student-guide": {
    title: "First-generation student guide to selective programs",
    category: "Student Life",
    readTime: 12,
    date: "Aug 2026",
    cover: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=70",
    content: [
      "You don't have family who went to college. Maybe nobody in your family has. You're figuring this out on your own, or with the help of a teacher or counselor who became your de facto family for this process. This guide is for you.",
      "First, the good news. Selective programs are actively looking for first-generation students. The data is on your side. Ivy League schools admit first-gen at 2-3x the rate of the general population. State flagships have dedicated first-gen programs. Private colleges often have full-ride scholarships specifically for first-gen students. You are wanted.",
      "Second, the harder news. You will face challenges that your continuing-generation peers don't. You might not know how to ask for a recommendation. You might not know that you should take SAT subject tests (you don't, but you might think you should). You might not have a parent who can proofread your essay at 11pm. You might feel like an imposter in a room full of people whose parents are doctors and lawyers. These are real, and they matter. The good news: there are people and resources specifically for you.",
      "Step 1: Tell your school counselor you're first-gen. Most schools track this. If yours doesn't, ask to be flagged anyway. Many selective programs have first-gen application tracks with extra essay prompts that let you explain your context. You can't use them if the school doesn't know.",
      "Step 2: Find your people. The single most important thing you can do is find one adult, a teacher, a counselor, a community leader, or a program alum, who will help you navigate this. Most selective programs have admissions ambassadors (current students who talk to applicants). Reach out to them. They want to help. Ask the questions you're embarrassed to ask. The application is the same for everyone. The preparation is not.",
      "Step 3: Apply to programs designed for first-gen students. QuestBridge (free application to 45+ top colleges). Jack Kent Cooke College Scholarship (up to $55k/year). POSSE Foundation (full-tuition leadership scholarships at partner schools). Coca-Cola Scholars Program ($20k). These are not fallback options. Many QuestBridge finalists get into Ivies with full rides.",
      "Step 4: Use your essay to explain your context. The Common App has a 'more information' section. Use it. Briefly explain: you're first-gen, you worked 20 hours/week to help your family, your school didn't offer AP classes, you're the first in your family to apply to college. Admissions officers want this context. They read thousands of essays about winning the debate tournament. Yours is about survival and ambition. That's a better essay.",
      "Step 5: Apply to your state flagships. They're often more generous with first-gen students than elite privates, and they're excellent schools. If you're in California, UC schools admit first-gen at higher rates than the general population AND give need-based aid. State schools are not a backup. They're often the best financial and academic fit.",
      "Step 6: Get help with the parts that are foreign. The FAFSA. The CSS Profile. The recommendation letter format. The interview. You don't have to figure this out alone. Most schools have first-gen-specific webinars, Slack groups, and one-on-one counseling. Use them. The people running these programs got where they are by helping students like you.",
      "Finally, the most important thing: your application is not less legitimate because you're first-gen. You bring a perspective to a college classroom that the legacy kid from Scarsdale cannot. Admissions officers know this. They are explicitly trying to build a class that includes you. Apply. Apply broadly. Apply with the assumption that you belong there, because you do.",
    ],
  },
};

export function BlogPostContent({ slug }: { slug: string }) {
  const post = POSTS[slug];
  const [copied, setCopied] = useState(false);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <>
      <ScrollProgress />
      <AnimatedNav />
      <main className="flex-1 pt-24">
        <article className="relative mx-auto max-w-3xl px-6 pb-20">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to blog
          </Link>
          <div className="mt-6 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-medium text-primary">
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {post.date}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {post.readTime} min read
            </span>
          </div>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">{post.title}</h1>
          <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
            <img src={post.cover} alt="" className="h-full w-full object-cover" />
          </div>
          <div className="mt-10 max-w-none space-y-5 text-base leading-relaxed text-foreground/85">
            {post.content.map((p, i) => (
              <p key={i} className={i === 0 ? "text-lg font-medium text-foreground" : ""}>{p}</p>
            ))}
          </div>
          {RELATED_LINKS[slug as keyof typeof RELATED_LINKS] && (
            <div className="mt-8 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-5">
              <p className="text-sm font-semibold text-foreground">Find these on Blueprint</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {RELATED_LINKS[slug as keyof typeof RELATED_LINKS].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-primary/40 hover:bg-primary/5"
                  >
                    {link.label} <ArrowUpRight className="h-3 w-3" />
                  </Link>
                ))}
              </div>
            </div>
          )}
          <div className="mt-10 flex items-center gap-3 border-t border-border pt-6">
            <button
              type="button"
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition hover:border-primary/40 hover:text-primary"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-success" /> Copied
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4" /> Copy link
                </>
              )}
            </button>
            <Link href="/blog" className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
              More articles <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
