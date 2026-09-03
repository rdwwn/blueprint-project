"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export function LetterStagger({
  text,
  className,
  delay = 0.05,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.span
      className={cn("inline-block [perspective:600px]", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ staggerChildren: 0.028, delayChildren: delay }}
      aria-label={text}
      role="text"
    >
      {text.split("").map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block will-change-transform [transform-style:preserve-3d]"
          variants={{
            hidden: { y: "0.7em", opacity: 0, rotateX: -70 },
            visible: { y: 0, opacity: 1, rotateX: 0 },
          }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          {ch === " " ? "\u00A0" : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}