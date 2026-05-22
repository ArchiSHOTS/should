"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ── Word pool ─────────────────────────────────────────────────────────────────
// 15 mindfulness-themed phrases; 4 are randomly chosen per session.
// Each shows for 800 ms × 4 = 3 200 ms, matching REFLECTION_DURATION exactly.
const WORD_POOL = [
  "Breathing...",
  "Reflecting...",
  "Sitting with it...",
  "Feeling it through...",
  "Checking the ego...",
  "Is this true?",
  "Is this necessary?",
  "Is this kind?",
  "Weighing your words...",
  "Pausing with purpose...",
  "Let it settle...",
  "Looking inward...",
  "Finding your calm...",
  "The words can wait...",
  "One breath more...",
];

const WORD_INTERVAL_MS = 800;
const WORDS_PER_SESSION = 4;

function pickWords(): string[] {
  return [...WORD_POOL]
    .sort(() => Math.random() - 0.5)
    .slice(0, WORDS_PER_SESSION);
}

// ── Wing animation ────────────────────────────────────────────────────────────
// scaleX collapses each wing toward the body edge (transformOrigin set below).
const FLAP = {
  animate: { scaleX: [1, 0.06, 1] as [number, number, number] },
  transition: {
    duration: 1.15,
    repeat: Infinity,
    ease: "easeInOut" as const,
    repeatDelay: 0.3,
  },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ReflectionSpinner({ isLoading }: { isLoading: boolean }) {
  const [words, setWords] = useState<string[]>([]);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    setWords(pickWords());
    setIdx(0);
    const t = setInterval(() => setIdx((i) => i + 1), WORD_INTERVAL_MS);
    return () => clearInterval(t);
  }, [isLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="reflection-spinner"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex flex-col items-center justify-center gap-8 py-16"
        >
          {/* ── Butterfly ── */}
          <div className="relative flex items-center justify-center">
            {/* Soft glow halo */}
            <div className="absolute w-32 h-32 rounded-full bg-sage/10 blur-2xl" />

            {/*
              viewBox 0 0 80 72
              Body centre: x=40, y=36
              Two vertical bars: x 35–39 and x 41–45, y 14–58
              Upper wings span roughly x 3–35 / 45–77, y 6–45
              Lower wings span roughly x 6–35 / 45–74, y 36–68
            */}
            <motion.svg
              viewBox="0 0 80 72"
              width="104"
              height="94"
              fill="none"
              stroke="#7B9E87"
              strokeLinecap="round"
              strokeLinejoin="round"
              // Gentle float
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              {/* ── Left wings (pivot from right edge of their bbox → body) ── */}
              <motion.g
                animate={FLAP.animate}
                transition={FLAP.transition}
                style={{ transformBox: "fill-box", transformOrigin: "right center" }}
              >
                {/* Upper left */}
                <path strokeWidth="1.8"
                  d="M35,18 C22,6 3,10 3,26 C3,40 20,45 35,38" />
                {/* Lower left */}
                <path strokeWidth="1.8"
                  d="M35,36 C20,42 6,54 9,62 C12,68 30,65 35,52" />
              </motion.g>

              {/* ── Right wings (pivot from left edge of their bbox → body) ── */}
              <motion.g
                animate={FLAP.animate}
                transition={FLAP.transition}
                style={{ transformBox: "fill-box", transformOrigin: "left center" }}
              >
                {/* Upper right */}
                <path strokeWidth="1.8"
                  d="M45,18 C58,6 77,10 77,26 C77,40 60,45 45,38" />
                {/* Lower right */}
                <path strokeWidth="1.8"
                  d="M45,36 C60,42 74,54 71,62 C68,68 50,65 45,52" />
              </motion.g>

              {/* ── Body (two vertical bars, static) ── */}
              <rect x="35" y="14" width="4"   height="44" rx="2" strokeWidth="1.8" />
              <rect x="41" y="14" width="4"   height="44" rx="2" strokeWidth="1.8" />

              {/* ── Antennae ── */}
              <path strokeWidth="1.4" d="M37,14 Q31,7 27,3" />
              <path strokeWidth="1.4" d="M43,14 Q49,7 53,3" />
              <circle cx="27" cy="3" r="2" fill="#7B9E87" stroke="none" />
              <circle cx="53" cy="3" r="2" fill="#7B9E87" stroke="none" />
            </motion.svg>
          </div>

          {/* ── Cycling word ── */}
          <div className="h-7 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              {words.length > 0 && (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="text-sm text-stone-500 font-serif italic tracking-wide text-center"
                >
                  {words[idx % WORDS_PER_SESSION]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* ── Breathing dots ── */}
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
