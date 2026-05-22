"use client";

import { useState, useEffect } from "react";
import type { Context, Mood, Goal, InterrogationAnswers } from "@/types";
import {
  BriefcaseIcon, LeafIcon, ZapIcon, SparklesIcon,
  WavesIcon, StarIcon, FlameIcon, CloudRainIcon, EyeIcon,
  LightbulbIcon, LinkIcon, WindIcon, CompassIcon, SwordsIcon,
} from "@/components/Icons";

interface Option<T> {
  value: T;
  label: string;
  icon: React.ReactNode;
  description: string;
}

const contextOptions: Option<Context>[] = [
  { value: "professional", label: "Professional", icon: <BriefcaseIcon size={22} />, description: "Work, career, industry, colleagues" },
  { value: "personal",     label: "Personal",     icon: <LeafIcon size={22} />,      description: "Friends, family, life experiences" },
  { value: "conflict",     label: "Conflict",     icon: <ZapIcon size={22} />,       description: "Disagreement, frustration, confrontation" },
  { value: "creative",     label: "Creative",     icon: <SparklesIcon size={22} />,  description: "Art, ideas, projects, expression" },
];

const moodOptions: Option<Mood>[] = [
  { value: "calm",               label: "Calm",               icon: <WavesIcon size={22} />,     description: "Clear-headed, balanced, at ease" },
  { value: "excited",            label: "Excited",            icon: <StarIcon size={22} />,      description: "Energised, enthusiastic, inspired" },
  { value: "angry",              label: "Angry",              icon: <FlameIcon size={22} />,     description: "Frustrated, irritated, heated" },
  { value: "sad",                label: "Sad",                icon: <CloudRainIcon size={22} />, description: "Hurt, grieving, low, depleted" },
  { value: "seeking_validation", label: "Seeking Validation", icon: <EyeIcon size={22} />,       description: "Wanting reassurance, approval, or likes" },
];

const goalOptions: Option<Goal>[] = [
  { value: "to_inform",      label: "To Inform",      icon: <LightbulbIcon size={22} />, description: "Share knowledge, news, or insight" },
  { value: "to_connect",     label: "To Connect",     icon: <LinkIcon size={22} />,      description: "Build relationship, express care" },
  { value: "to_vent",        label: "To Vent",        icon: <WindIcon size={22} />,      description: "Release feelings, blow off steam" },
  { value: "to_seek_advice", label: "To Seek Advice", icon: <CompassIcon size={22} />,   description: "Ask for help, perspective, or guidance" },
  { value: "to_get_revenge", label: "To Get Revenge", icon: <SwordsIcon size={22} />,    description: "Shame, expose, or retaliate against someone" },
];

const steps = [
  {
    key: "context" as const,
    title: "What is the context?",
    subtitle: "Take a breath. Where is this post coming from?",
    options: contextOptions,
  },
  {
    key: "mood" as const,
    title: "What is your present mood?",
    subtitle: "Be honest with yourself — no one else is reading this.",
    options: moodOptions,
  },
  {
    key: "goal" as const,
    title: "What is your ultimate goal?",
    subtitle: "What are you hoping will happen after you post?",
    options: goalOptions,
  },
];

interface InterrogationModalProps {
  onComplete: (answers: InterrogationAnswers) => void;
  onClose: () => void;
}

export default function InterrogationModal({
  onComplete,
  onClose,
}: InterrogationModalProps) {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [answers, setAnswers] = useState<Partial<InterrogationAnswers>>({});
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    // Entrance fade
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  function selectOption(value: string) {
    if (transitioning) return;

    const currentStep = steps[step];
    const newAnswers = { ...answers, [currentStep.key]: value };
    setAnswers(newAnswers);

    if (step < steps.length - 1) {
      setTransitioning(true);
      setTimeout(() => {
        setStep((s) => s + 1);
        setTransitioning(false);
      }, 400);
    } else {
      // Final answer — hand off after brief pause
      setTimeout(() => {
        onComplete(newAnswers as InterrogationAnswers);
      }, 300);
    }
  }

  function goBack() {
    if (step === 0 || transitioning) return;
    setTransitioning(true);
    setTimeout(() => {
      const prevKey = steps[step - 1].key;
      setAnswers((prev) => {
        const a = { ...prev };
        delete a[prevKey];
        return a;
      });
      setStep((s) => s - 1);
      setTransitioning(false);
    }, 400);
  }

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const current = steps[step];

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-stone-900/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-lg bg-parchment rounded-3xl shadow-2xl shadow-stone-900/10 p-8 transition-all duration-400 ${
          transitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* Progress dots */}
        <div className="flex gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                i <= step ? "bg-sage" : "bg-stone-200"
              }`}
            />
          ))}
        </div>

        {/* Step label */}
        <p className="text-xs font-medium text-sage uppercase tracking-widest mb-2">
          Step {step + 1} of {steps.length}
        </p>

        {/* Question */}
        <h2 className="text-2xl font-serif text-stone-800 mb-2 leading-snug">
          {current.title}
        </h2>
        <p className="text-sm text-stone-500 mb-7 italic">{current.subtitle}</p>

        {/* Options */}
        <div className="flex flex-col gap-3">
          {current.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => selectOption(opt.value)}
              className="group flex items-center gap-4 w-full text-left p-4 rounded-2xl border border-stone-200 bg-white/60 hover:border-sage hover:bg-sage/5 transition-all duration-200 hover:shadow-sm"
            >
              <span className="shrink-0 text-sage">{opt.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 group-hover:text-sage-dark transition-colors">
                  {opt.label}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">{opt.description}</p>
              </div>
              <span className="text-stone-300 group-hover:text-sage transition-colors ml-1">
                →
              </span>
            </button>
          ))}
        </div>

        {/* Back navigation — only visible from step 2 onward */}
        {step > 0 && (
          <button
            onClick={goBack}
            disabled={transitioning}
            className="mt-5 w-full text-sm text-stone-400 hover:text-stone-600 transition-colors py-2 disabled:opacity-40"
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
