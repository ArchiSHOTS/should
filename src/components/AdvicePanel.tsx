"use client";

import { useEffect, useRef, useState } from "react";
import type { AdviceResult, InterrogationAnswers, AuthState } from "@/types";
import { CheckIcon, PauseIcon, XIcon, ClockIcon, AlertIcon, ChevronDownIcon } from "@/components/Icons";
import { getRandomQuote, type Quote } from "@/lib/quotes";
import { analyzeText } from "@/lib/advice-engine";
import { encrypt, hashUserId } from "@/lib/crypto";

interface AdvicePanelProps {
  advice: AdviceResult;
  answers: InterrogationAnswers;
  draft: string;
  auth: AuthState | null;
  onDiscard: () => void;
  onLoginRequest: () => void;
}

const verdictConfig = {
  POST: {
    label: "Post It",
    color: "text-sage",
    bg: "bg-sage/10",
    border: "border-sage/30",
    badgeBg: "bg-sage",
    icon: <CheckIcon size={24} />,
    tagline: "You're good to go.",
  },
  HOLD: {
    label: "Hold Back",
    color: "text-amber",
    bg: "bg-amber/10",
    border: "border-amber/30",
    badgeBg: "bg-amber",
    icon: <PauseIcon size={24} />,
    tagline: "Let this breathe first.",
  },
  DROP: {
    label: "Let It Go",
    color: "text-rose-muted",
    bg: "bg-rose-muted/10",
    border: "border-rose-muted/30",
    badgeBg: "bg-rose-muted",
    icon: <XIcon size={24} />,
    tagline: "This one isn't worth it.",
  },
};

// Map raw TextSignal flags to human-readable observations shown in the UI
function buildTextObservations(draft: string): string[] {
  const t = analyzeText(draft);
  const obs: string[] = [];

  if (t.inferredTone === "hostile")
    obs.push("Hostile tone detected in the writing itself");
  if (t.inferredTone === "celebratory" || t.inferredTone === "positive")
    obs.push("Positive, constructive tone in the text");
  if (t.hasAggression)
    obs.push("Aggressive or threatening language present");
  if (t.hasProfanity)
    obs.push("Strong language / profanity detected");
  if (t.hasCallout)
    obs.push("Direct callout or naming of a person");
  if (t.hasRevengeLang)
    obs.push("Revenge or exposure-oriented phrasing");
  if (t.hasVenting && t.hasFirstPersonGrievance)
    obs.push("Venting patterns ('they always', 'you never')");
  if (t.hasExcessiveEmphasis)
    obs.push("Excessive caps / punctuation (emotional intensity)");
  if (t.hasSelfDoubt)
    obs.push("Self-doubt phrasing ('am I wrong', 'is it just me')");
  if (t.hasCalmReflection)
    obs.push("Thoughtful, reflective language");
  if (t.hasPositiveIntent)
    obs.push("Clear positive purpose in the writing");

  return obs;
}

export default function AdvicePanel({
  advice,
  answers,
  draft,
  auth,
  onDiscard,
  onLoginRequest,
}: AdvicePanelProps) {
  const [quote] = useState<Quote>(() => getRandomQuote());
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [showSignals, setShowSignals] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 30);
    return () => clearTimeout(t);
  }, []);

  const config = verdictConfig[advice.verdict];
  const textObservations = buildTextObservations(draft);

  async function handleCopy() {
    await navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSave() {
    if (!auth) {
      onLoginRequest();
      return;
    }

    setSaving(true);
    setSaveError(null);

    try {
      const userId = await hashUserId(auth.mnemonic);
      const payload = {
        content: draft,
        context: answers.context,
        mood: answers.mood,
        goal: answers.goal,
        advice,
        timestamp: new Date().toISOString(),
      };
      const { iv, salt, ciphertext } = await encrypt(auth.mnemonic, payload);

      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, iv, salt, ciphertext }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error ?? "Failed to save");
      }

      setSaved(true);
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      ref={panelRef}
      className={`transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Verdict card */}
      <div className={`rounded-3xl border ${config.border} ${config.bg} p-8 mb-4`}>
        <div className="flex items-start gap-5">
          <div
            className={`w-14 h-14 rounded-2xl ${config.badgeBg} text-white flex items-center justify-center text-xl font-bold shrink-0`}
          >
            {config.icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium uppercase tracking-widest text-stone-400 mb-1">
              Our recommendation
            </p>
            <h2 className={`text-3xl font-serif ${config.color} mb-1`}>
              {config.label}
            </h2>
            <p className="text-sm text-stone-500 italic mb-4">{config.tagline}</p>

            <p className="text-stone-700 leading-relaxed text-[15px]">
              {advice.reason}
            </p>

            {advice.holdDuration && (
              <div className="mt-4 inline-flex items-center gap-2 bg-white/70 border border-amber/20 rounded-full px-4 py-1.5">
                <ClockIcon size={13} className="text-amber shrink-0" />
                <span className="text-xs text-stone-600">
                  Suggested wait:{" "}
                  <strong className="font-medium">{advice.holdDuration}</strong>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Text signal breakdown — collapsible */}
      {textObservations.length > 0 && (
        <div className="mb-6">
          <button
            onClick={() => setShowSignals((s) => !s)}
            className="w-full flex items-center justify-between px-5 py-3 bg-white/50 border border-stone-100 rounded-2xl text-sm text-stone-500 hover:border-stone-200 transition-colors"
          >
            <span className="font-medium text-stone-600">
              What we found in your text
            </span>
            <ChevronDownIcon
              size={16}
              className={`text-stone-300 transition-transform duration-200 ${showSignals ? "rotate-180" : ""}`}
            />
          </button>

          {showSignals && (
            <div className="mt-2 px-5 py-4 bg-white/40 border border-stone-100 rounded-2xl">
              <ul className="flex flex-col gap-2">
                {textObservations.map((obs) => {
                  const isWarning =
                    obs.toLowerCase().includes("aggressive") ||
                    obs.toLowerCase().includes("hostile") ||
                    obs.toLowerCase().includes("callout") ||
                    obs.toLowerCase().includes("revenge") ||
                    obs.toLowerCase().includes("profanity") ||
                    obs.toLowerCase().includes("venting") ||
                    obs.toLowerCase().includes("caps") ||
                    obs.toLowerCase().includes("doubt");
                  return (
                    <li key={obs} className="flex items-start gap-2.5 text-sm">
                      {isWarning
                        ? <AlertIcon size={14} className="mt-0.5 shrink-0 text-amber" />
                        : <CheckIcon size={14} className="mt-0.5 shrink-0 text-sage" />
                      }
                      <span className="text-stone-600">{obs}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="text-xs text-stone-400 mt-3 italic">
                Analysis runs entirely in your browser — your text is never sent anywhere.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Stoic quote */}
      <div className="bg-white/50 border border-stone-100 rounded-2xl px-7 py-6 mb-8">
        <p className="font-serif text-stone-700 text-lg leading-relaxed mb-3 italic">
          &ldquo;{quote.text}&rdquo;
        </p>
        <p className="text-xs text-stone-400 font-medium tracking-wide">
          — {quote.author}
        </p>
      </div>

      {/* Action row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onDiscard}
          className="flex-1 min-w-[120px] px-6 py-3 rounded-full border border-stone-200 text-stone-500 text-sm font-medium hover:border-stone-300 hover:text-stone-700 transition-all duration-200"
        >
          Discard
        </button>

        <button
          onClick={handleCopy}
          className="flex-1 min-w-[120px] px-6 py-3 rounded-full border border-stone-200 text-stone-600 text-sm font-medium hover:border-sage hover:text-sage transition-all duration-200"
        >
          {copied ? "Copied ✓" : "Copy Text"}
        </button>

        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex-1 min-w-[120px] px-6 py-3 rounded-full bg-sage text-white text-sm font-medium hover:bg-sage-dark transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Saving…" : saved ? "Saved to Journal ✓" : "Save to Journal"}
        </button>
      </div>

      {saveError && (
        <p className="mt-3 text-sm text-rose-muted text-center">{saveError}</p>
      )}

      {!auth && !saved && (
        <p className="mt-3 text-xs text-stone-400 text-center">
          Saving requires your passphrase.{" "}
          <button
            onClick={onLoginRequest}
            className="underline hover:text-sage transition-colors"
          >
            Log in
          </button>
        </p>
      )}
    </div>
  );
}
