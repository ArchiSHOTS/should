"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DraftEditor from "@/components/DraftEditor";
import InterrogationModal from "@/components/InterrogationModal";
import AdvicePanel from "@/components/AdvicePanel";
import MnemonicAuth from "@/components/MnemonicAuth";
import ReflectionSpinner from "@/components/ReflectionSpinner";
import { getAdvice } from "@/lib/advice-engine";
import type { InterrogationAnswers, AdviceResult, AuthState } from "@/types";


// How long the spinner runs before the advice panel appears (ms).
// Enough to cycle through ~3 reflection phrases — feels deliberate, not slow.
const REFLECTION_DURATION = 3200;

type Stage = "draft" | "interrogating" | "reflecting" | "advice";

export default function Home() {
  const [stage, setStage] = useState<Stage>("draft");
  const [draft, setDraft] = useState("");
  const [answers, setAnswers] = useState<InterrogationAnswers | null>(null);
  const [advice, setAdvice] = useState<AdviceResult | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [auth, setAuth] = useState<AuthState | null>(null);

  // Restore session silently on mount
  useEffect(() => {
    const stored = sessionStorage.getItem("sip_mnemonic");
    if (stored) setAuth({ mnemonic: stored });
  }, []);

  function handleGetAdvice() {
    if (!draft.trim()) return;
    setStage("interrogating");
  }

  const handleInterrogationComplete = useCallback(
    (ans: InterrogationAnswers) => {
      // Compute advice immediately (synchronous) but hold the result behind
      // the spinner so the transition feels considered, not instant.
      const result = getAdvice(draft, ans.context, ans.mood, ans.goal);
      setAnswers(ans);
      setAdvice(result);
      setStage("reflecting");

      setTimeout(() => {
        setStage("advice");
      }, REFLECTION_DURATION);
    },
    [draft]
  );

  function handleDiscard() {
    setDraft("");
    setAnswers(null);
    setAdvice(null);
    setStage("draft");
  }

  function handleAuth(state: AuthState) {
    sessionStorage.setItem("sip_mnemonic", state.mnemonic);
    setAuth(state);
    setShowAuth(false);
  }

  function handleLogout() {
    sessionStorage.removeItem("sip_mnemonic");
    setAuth(null);
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <SiteHeader>
        <Link
          href="/gallery"
          className="text-sm text-stone-400 hover:text-sage transition-colors"
        >
          My Journal
        </Link>
        {auth ? (
          <button
            onClick={handleLogout}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
          >
            Lock
          </button>
        ) : (
          <button
            onClick={() => setShowAuth(true)}
            className="text-sm font-medium text-sage hover:text-sage-dark transition-colors border border-sage/30 rounded-full px-4 py-1.5 hover:border-sage hover:bg-sage/5"
          >
            Unlock Journal
          </button>
        )}
      </SiteHeader>

      {/* Main content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-6 py-14">

        {/* Stage headings */}
        {stage === "draft" && (
          <div className="mb-10">
            <h1 className="text-4xl font-serif text-stone-800 leading-snug mb-3">
              Think before you post.
            </h1>
            <p className="text-stone-500 leading-relaxed max-w-md animate-breathe">
              Write your draft freely. We&apos;ll help you decide if it&apos;s worth
              putting into the world.
            </p>
          </div>
        )}

        {stage === "advice" && (
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-stone-700 mb-1">
              Here&apos;s our take.
            </h2>
            <p className="text-sm text-stone-400">
              This is just a nudge — the final call is always yours.
            </p>
          </div>
        )}

        {/* Draft editor */}
        {stage === "draft" && (
          <DraftEditor
            value={draft}
            onChange={setDraft}
            onGetAdvice={handleGetAdvice}
          />
        )}

        {/* Reflection spinner — shown after interrogation, before advice */}
        <ReflectionSpinner isLoading={stage === "reflecting"} />

        {/* Advice panel */}
        {stage === "advice" && advice && answers && (
          <AdvicePanel
            advice={advice}
            answers={answers}
            draft={draft}
            auth={auth}
            onDiscard={handleDiscard}
            onLoginRequest={() => setShowAuth(true)}
          />
        )}

        {/* Privacy note */}
        <div className="mt-16 pt-8 border-t border-stone-100">
          <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {[
              "No account needed",
              "Zero tracking",
              "End-to-end encrypted",
              "No ads ever",
            ].map((item) => (
              <span key={item} className="text-xs text-stone-400 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-sage inline-block" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Interrogation modal */}
      {stage === "interrogating" && (
        <InterrogationModal
          onComplete={handleInterrogationComplete}
          onClose={() => setStage("draft")}
        />
      )}

      {/* Auth modal */}
      {showAuth && (
        <MnemonicAuth
          onAuth={handleAuth}
          onClose={() => setShowAuth(false)}
        />
      )}

      <SiteFooter />
    </div>
  );
}
