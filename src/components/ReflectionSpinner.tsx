"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const REFLECTION_WORDS = [
  "Reflecting...",
  "Breathe...",
  "Analyzing intent...",
  "Consulting Marcus Aurelius...",
  "Checking the ego...",
  "Wait for it...",
  "Is it true?",
  "Is it necessary?",
  "Is it kind?",
  "Calculating dopamine debt...",
  "Scanning for red mist...",
  "Evaluating the fallout...",
];

interface ReflectionSpinnerProps {
  isLoading: boolean;
}

// SVG ring constants
const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReflectionSpinner({ isLoading }: ReflectionSpinnerProps) {
  const [wordIndex, setWordIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Rotate through words every 1.5 s
  useEffect(() => {
    if (!isLoading) return;
    setWordIndex(0);
    setProgress(0);

    const wordTimer = setInterval(() => {
      setWordIndex((i) => (i + 1) % REFLECTION_WORDS.length);
    }, 1500);

    return () => clearInterval(wordTimer);
  }, [isLoading]);

  // Smoothly animate the progress ring (0 → 100% over ~6 s, then loops)
  useEffect(() => {
    if (!isLoading) return;
    setProgress(0);

    let start: number | null = null;
    const DURATION = 6000;
    let raf: number;

    function tick(ts: number) {
      if (start === null) start = ts;
      const elapsed = (ts - start) % DURATION;
      setProgress(elapsed / DURATION);
      raf = requestAnimationFrame(tick);
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isLoading]);

  const strokeDashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="reflection-spinner"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.92 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-7 py-16"
        >
          {/* Progress ring */}
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* Soft glow backdrop */}
            <div className="absolute inset-0 rounded-full bg-sage/8 blur-lg scale-110" />

            <svg
              width="96"
              height="96"
              viewBox="0 0 96 96"
              className="absolute inset-0 -rotate-90"
              fill="none"
            >
              {/* Track */}
              <circle
                cx="48"
                cy="48"
                r={RADIUS}
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-stone-200"
              />
              {/* Animated arc */}
              <motion.circle
                cx="48"
                cy="48"
                r={RADIUS}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                className="text-sage"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: "stroke-dashoffset 0.1s linear" }}
              />
            </svg>

            {/* Inner leaf icon — pulses gently */}
            <motion.span
              animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="text-2xl relative z-10 select-none"
            >
              🌿
            </motion.span>
          </div>

          {/* Cycling word */}
          <div className="h-7 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={wordIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="text-sm text-stone-500 font-serif italic tracking-wide text-center"
              >
                {REFLECTION_WORDS[wordIndex]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Subtle breathing dots */}
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="w-1 h-1 rounded-full bg-sage/50 inline-block"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{
                  duration: 1.4,
                  repeat: Infinity,
                  delay: i * 0.22,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
