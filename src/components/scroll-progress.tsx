"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "motion/react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const scrollYProgress = useSpring(progress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-[3px]">
      <motion.div
        style={{ scaleX: scrollYProgress }}
        aria-hidden
        className="h-full origin-left bg-gradient-to-r from-primary to-accent"
      />
      <motion.div
        style={{ left: scrollYProgress }}
        aria-hidden
        className="absolute -top-px h-[5px] w-[5px] -translate-x-1/2 rotate-45 bg-accent shadow-[0_0_8px_0_color-mix(in_srgb,var(--accent)_70%,transparent)]"
      />
    </div>
  );
}
