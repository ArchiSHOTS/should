"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useInView,
  type Variants,
} from "framer-motion";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

// ── Shared animation helpers ──────────────────────────────────────────────────

function FadeUp({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

// ── Section wrapper ───────────────────────────────────────────────────────────

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`max-w-5xl mx-auto px-6 ${className}`}>
      {children}
    </section>
  );
}

// ── Data ──────────────────────────────────────────────────────────────────────

const steps = [
  {
    number: "01",
    title: "Paste",
    subtitle: "Write without a filter.",
    body: "Drop your raw, unedited draft into the editor. No judgment, no audience — just your thoughts as they are right now.",
    icon: "✍️",
  },
  {
    number: "02",
    title: "Pause",
    subtitle: "Three honest questions.",
    body: "We ask about your context, your mood, and what you're actually hoping to achieve. The slowdown is the point.",
    icon: "⏸",
  },
  {
    number: "03",
    title: "Decide",
    subtitle: "Post, hold, or let go.",
    body: "Your draft gets a verdict — rooted in what you wrote and how you feel — with a Stoic quote to sit with before you act.",
    icon: "🧭",
  },
];

const proFeatures = [
  {
    icon: "✦",
    title: "Rephrasing Help",
    body: "Get AI-assisted rewrites that preserve your intent while cooling the temperature of your language.",
  },
  {
    icon: "◎",
    title: "Inner Circle Voting",
    body: "Send a draft to up to 3 trusted people — anonymously — and collect their honest reactions before you post.",
  },
  {
    icon: "📖",
    title: "Growth Gallery",
    body: "Your encrypted journal of every thought you paused on. Revisit the posts you didn't send — and reflect on the ones you did.",
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.12 },
  }),
};

// ── Component ─────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });

  const proRef = useRef<HTMLDivElement>(null);
  const proInView = useInView(proRef, { once: true, margin: "-80px" });

  return (
    <div className="min-h-screen bg-background text-stone-800 overflow-x-hidden">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <SiteHeader>
        <Link
          href="/gallery"
          className="hidden sm:block text-sm text-stone-500 hover:text-sage transition-colors"
        >
          My Journal
        </Link>
        <Link href="/think">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-sage text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-sage-dark transition-colors"
          >
            Get a Second Thought
          </motion.button>
        </Link>
      </SiteHeader>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <Section className="pt-28 pb-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 bg-sage/10 border border-sage/20 text-sage text-xs font-medium px-4 py-1.5 rounded-full mb-8 tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse inline-block" />
            Mindful by design
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-stone-900 leading-[1.08] tracking-tight mb-7 max-w-3xl mx-auto">
            The space between{" "}
            <span className="italic text-sage">impulse</span>
            <br className="hidden sm:block" /> and regret.
          </h1>

          {/* Sub */}
          <p className="text-stone-500 text-lg sm:text-xl max-w-xl mx-auto leading-relaxed mb-12">
            Write the post. Answer three honest questions. Get a verdict —
            and decide from a calmer place.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/think">
              <motion.button
                animate={{
                  boxShadow: [
                    "0 0 0px 0px rgba(123,158,135,0)",
                    "0 0 22px 6px rgba(123,158,135,0.28)",
                    "0 0 0px 0px rgba(123,158,135,0)",
                  ],
                }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="bg-sage text-white font-medium px-8 py-4 rounded-full text-base hover:bg-sage-dark transition-colors"
              >
                Get Started — it&apos;s free
              </motion.button>
            </Link>
            <p className="text-xs text-stone-400">
              No sign-up. No email. No tracking.
            </p>
          </div>
        </motion.div>

        {/* Hero visual — floating mock card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
          className="mt-20 max-w-xl mx-auto"
        >
          <div className="bg-white border border-stone-100 rounded-3xl shadow-xl shadow-stone-900/5 p-8 text-left">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-amber flex items-center justify-center text-white font-bold text-sm">
                ⏸
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase tracking-widest">
                  Our recommendation
                </p>
                <p className="font-serif text-xl text-amber leading-tight">
                  Hold Back
                </p>
              </div>
            </div>
            <p className="text-stone-600 text-sm leading-relaxed mb-5">
              You&apos;re writing about a conflict while feeling angry, and the text confirms it. Give it a day — the words will still be here.
            </p>
            <div className="flex items-center gap-2 text-xs text-stone-400 italic font-serif">
              <span className="text-stone-300 text-base">&ldquo;</span>
              You have power over your mind, not outside events.
              <span className="not-italic text-stone-400 ml-1">— Marcus Aurelius</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-stone-100" />
      </div>

      {/* ── FEATURE GRID ────────────────────────────────────────────────── */}
      <Section className="py-28">
        <FadeUp className="text-center mb-16">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-3 font-medium">
            How it works
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-snug">
            Three steps. One better decision.
          </h2>
        </FadeUp>

        <div ref={featuresRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={featuresInView ? "visible" : "hidden"}
              className="bg-white border border-stone-100 rounded-3xl p-8 hover:shadow-md hover:shadow-stone-900/5 transition-shadow duration-300 group"
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl">{step.icon}</span>
                <span className="text-xs font-mono text-stone-300">{step.number}</span>
              </div>
              <h3 className="font-serif text-2xl text-stone-900 mb-1 group-hover:text-sage transition-colors">
                {step.title}
              </h3>
              <p className="text-sm font-medium text-sage mb-3">{step.subtitle}</p>
              <p className="text-stone-500 text-sm leading-relaxed">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-stone-100" />
      </div>

      {/* ── SECURITY CALLOUT ────────────────────────────────────────────── */}
      <Section className="py-28">
        <FadeUp>
          <div className="bg-stone-900 text-white rounded-3xl p-10 sm:p-14 flex flex-col sm:flex-row gap-10 items-start">
            {/* Shield */}
            <div className="shrink-0 w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center text-3xl">
              🛡
            </div>

            <div className="flex-1">
              <p className="text-xs text-stone-400 uppercase tracking-widest mb-3 font-medium">
                Privacy Architecture
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl text-white leading-snug mb-5">
                Your identity is a{" "}
                <span className="italic text-sage">12-word phrase.</span>
                <br className="hidden sm:block" /> Nothing else.
              </h2>
              <p className="text-stone-400 leading-relaxed mb-8 max-w-lg text-[15px]">
                We use the same BIP39 mnemonic standard that secures billions
                in crypto wallets. No email. No password. No account. Your
                journal is encrypted client-side before it ever touches our
                servers — we literally cannot read it.
              </p>

              {/* Guarantee pills */}
              <div className="flex flex-wrap gap-3">
                {[
                  "No email required",
                  "End-to-end encrypted",
                  "Zero IP logging",
                  "No tracking cookies",
                  "Open-source crypto",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 text-xs bg-white/10 text-stone-300 px-3.5 py-1.5 rounded-full"
                  >
                    <span className="w-1 h-1 rounded-full bg-sage inline-block" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </FadeUp>
      </Section>

      {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-stone-100" />
      </div>

      {/* ── PRO SECTION ─────────────────────────────────────────────────── */}
      <Section className="py-28">
        <FadeUp className="text-center mb-16">
          <p className="text-xs text-stone-400 uppercase tracking-widest mb-3 font-medium">
            Coming soon
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-snug mb-4">
            Go deeper with Pro.
          </h2>
          <p className="text-stone-500 max-w-md mx-auto">
            The free tier pauses you. Pro helps you grow.
          </p>
        </FadeUp>

        <div ref={proRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {proFeatures.map((feat, i) => (
            <motion.div
              key={feat.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={proInView ? "visible" : "hidden"}
              className="bg-white border border-stone-100 rounded-3xl p-8 group hover:border-sage/30 hover:shadow-md hover:shadow-sage/5 transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-xl bg-sage/10 text-sage flex items-center justify-center text-lg mb-6 font-mono">
                {feat.icon}
              </div>
              <h3 className="font-semibold text-stone-800 mb-2 group-hover:text-sage transition-colors">
                {feat.title}
              </h3>
              <p className="text-stone-500 text-sm leading-relaxed">{feat.body}</p>
            </motion.div>
          ))}
        </div>

        <FadeUp delay={0.3} className="flex justify-center">
          <div className="bg-sage/5 border border-sage/20 rounded-3xl px-10 py-8 text-center max-w-sm w-full">
            <p className="text-xs text-stone-400 uppercase tracking-widest mb-2 font-medium">
              Pro
            </p>
            <div className="font-serif text-5xl text-stone-900 mb-1">
              $4<span className="text-2xl text-stone-400">/mo</span>
            </div>
            <p className="text-sm text-stone-500 mb-6">
              Billed annually · Cancel anytime
            </p>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled
              className="w-full py-3 rounded-full bg-sage text-white text-sm font-medium opacity-50 cursor-not-allowed"
            >
              Join the waitlist
            </motion.button>
            <p className="text-xs text-stone-400 mt-3">
              Launching later this year
            </p>
          </div>
        </FadeUp>
      </Section>

      {/* ── DIVIDER ─────────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="border-t border-stone-100" />
      </div>

      {/* ── FOOTER CTA ──────────────────────────────────────────────────── */}
      <Section className="py-28 text-center">
        <FadeUp>
          <h2 className="font-serif text-4xl sm:text-5xl text-stone-900 leading-snug mb-6 max-w-xl mx-auto">
            Your next post can wait{" "}
            <span className="italic text-sage">30 seconds.</span>
          </h2>
          <p className="text-stone-500 mb-10 max-w-sm mx-auto">
            No account needed. Open the editor and write.
          </p>
          <Link href="/think">
            <motion.button
              animate={{
                boxShadow: [
                  "0 0 0px 0px rgba(123,158,135,0)",
                  "0 0 22px 6px rgba(123,158,135,0.28)",
                  "0 0 0px 0px rgba(123,158,135,0)",
                ],
              }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="bg-sage text-white font-medium px-10 py-4 rounded-full text-base hover:bg-sage-dark transition-colors"
            >
              Give it a second thought →
            </motion.button>
          </Link>
        </FadeUp>
      </Section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <SiteFooter />
    </div>
  );
}
