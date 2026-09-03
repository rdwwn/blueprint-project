"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/reveal";

const QUESTIONS = [
  {
    q: "What is Blueprint?",
    a: "Blueprint is a free database of verified opportunities for high school students: internships, scholarships, competitions, and research programs.",
  },
  {
    q: "How do I find opportunities?",
    a: "Use the search page to filter by field, category, location, and deadline. Or take the Find Your Path quiz to get personalized recommendations.",
  },
  {
    q: "Is it really free?",
    a: "Yes. Every opportunity in our database is free to apply to. We only list programs that don't charge application fees.",
  },
  {
    q: "How are opportunities verified?",
    a: "Every program is hand-researched and verified by our team. We check that it's free, currently accepting applications, and legitimate.",
  },
] as const;

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-6 text-left text-lg font-medium text-foreground transition-colors hover:text-primary"
      >
        {question}
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
          className="shrink-0 text-muted-foreground"
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pb-6 pr-8 text-muted-foreground leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="relative overflow-x-clip bg-muted">
      <div className="relative mx-auto max-w-6xl px-6 py-24">
        <Reveal className="mb-12 max-w-2xl">
          <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
            FAQ
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Questions & answers</h2>
          <p className="mt-4 text-base text-muted-foreground">Everything you need to know about Blueprint.</p>
        </Reveal>
        <Reveal>
          <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-card p-6 shadow-sm">
            {QUESTIONS.map((item, i) => (
              <AccordionItem
                key={item.q}
                question={item.q}
                answer={item.a}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
