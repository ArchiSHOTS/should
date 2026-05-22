"use client";

import { useState, useEffect } from "react";
import { AlertIcon } from "@/components/Icons";
import {
  generateMnemonic,
  validateMnemonic,
  getVerifyChallenge,
  checkVerification,
  normalizePhrase,
  type VerifyChallenge,
} from "@/lib/mnemonic";
import type { AuthState } from "@/types";

type Screen = "choose" | "generate-show" | "generate-verify" | "login";

interface MnemonicAuthProps {
  onAuth: (state: AuthState) => void;
  onClose: () => void;
}

export default function MnemonicAuth({ onAuth, onClose }: MnemonicAuthProps) {
  const [screen, setScreen] = useState<Screen>("choose");
  const [mnemonic, setMnemonic] = useState("");
  const [challenge, setChallenge] = useState<VerifyChallenge | null>(null);
  const [verifyAnswers, setVerifyAnswers] = useState<string[]>(["", "", ""]);
  const [verifyError, setVerifyError] = useState("");
  const [loginPhrase, setLoginPhrase] = useState("");
  const [loginError, setLoginError] = useState("");
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  function handleStartGenerate() {
    const phrase = generateMnemonic();
    setMnemonic(phrase);
    setScreen("generate-show");
  }

  async function handleCopyPhrase() {
    await navigator.clipboard.writeText(mnemonic);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleProceedToVerify() {
    const ch = getVerifyChallenge(mnemonic);
    setChallenge(ch);
    setVerifyAnswers(["", "", ""]);
    setVerifyError("");
    setScreen("generate-verify");
  }

  function handleVerify() {
    if (!challenge) return;
    if (checkVerification(challenge, verifyAnswers)) {
      onAuth({ mnemonic });
    } else {
      setVerifyError("One or more words are incorrect. Please try again.");
      setVerifyAnswers(["", "", ""]);
    }
  }

  function handleLogin() {
    const normalized = normalizePhrase(loginPhrase);
    if (!validateMnemonic(normalized)) {
      setLoginError(
        "That phrase doesn't look right. Please check spelling and word order."
      );
      return;
    }
    onAuth({ mnemonic: normalized });
  }

  const words = mnemonic ? mnemonic.split(" ") : [];

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

      <div className="relative w-full max-w-md bg-parchment rounded-3xl shadow-2xl shadow-stone-900/10 p-8 max-h-[90vh] overflow-y-auto">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-stone-400 hover:text-stone-600 transition-colors text-xl leading-none"
          aria-label="Close"
        >
          ×
        </button>

        {/* ── CHOOSE ── */}
        {screen === "choose" && (
          <div>
            <p className="text-xs font-medium text-sage uppercase tracking-widest mb-2">
              Private Access
            </p>
            <h2 className="text-2xl font-serif text-stone-800 mb-2">
              Your passphrase is your identity.
            </h2>
            <p className="text-sm text-stone-500 mb-8 leading-relaxed">
              We don&apos;t use emails or passwords. Your 12-word passphrase is the only
              key to your journal. We never store it — only you have it.
            </p>

            <div className="bg-amber/10 border border-amber/25 rounded-2xl p-4 mb-8 flex gap-3">
              <AlertIcon size={15} className="text-amber shrink-0 mt-0.5" />
              <p className="text-xs text-stone-600 leading-relaxed">
                <strong>We cannot reset your account.</strong> Lose the words, lose
                the data. There is no recovery option.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={handleStartGenerate}
                className="w-full py-4 rounded-2xl bg-sage text-white font-medium hover:bg-sage-dark transition-colors"
              >
                Generate a new passphrase
              </button>
              <button
                onClick={() => setScreen("login")}
                className="w-full py-4 rounded-2xl border border-stone-200 text-stone-600 font-medium hover:border-sage hover:text-sage transition-colors"
              >
                I already have one
              </button>
            </div>
          </div>
        )}

        {/* ── SHOW PHRASE ── */}
        {screen === "generate-show" && (
          <div>
            <p className="text-xs font-medium text-sage uppercase tracking-widest mb-2">
              Your Passphrase
            </p>
            <h2 className="text-2xl font-serif text-stone-800 mb-2">
              Write these 12 words down.
            </h2>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Store them somewhere safe and offline. A screenshot is not enough —
              write them on paper.
            </p>

            {/* Word grid */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {words.map((word, i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-100 rounded-xl px-3 py-2.5 flex items-center gap-2"
                >
                  <span className="text-xs text-stone-300 w-4 text-right shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-stone-700">{word}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleCopyPhrase}
              className="w-full mb-3 py-3 rounded-2xl border border-stone-200 text-stone-500 text-sm hover:border-sage hover:text-sage transition-colors"
            >
              {copied ? "Copied ✓" : "Copy to clipboard"}
            </button>

            <button
              onClick={handleProceedToVerify}
              className="w-full py-4 rounded-2xl bg-sage text-white font-medium hover:bg-sage-dark transition-colors"
            >
              I&apos;ve saved them — continue →
            </button>
          </div>
        )}

        {/* ── VERIFY ── */}
        {screen === "generate-verify" && challenge && (
          <div>
            <p className="text-xs font-medium text-sage uppercase tracking-widest mb-2">
              Verification
            </p>
            <h2 className="text-2xl font-serif text-stone-800 mb-2">
              Prove you saved them.
            </h2>
            <p className="text-sm text-stone-500 mb-7 leading-relaxed">
              Enter the words at the positions below to confirm you&apos;ve recorded
              your passphrase.
            </p>

            <div className="flex flex-col gap-4 mb-6">
              {challenge.indices.map((idx, i) => (
                <div key={idx}>
                  <label className="block text-xs text-stone-400 mb-1.5">
                    Word #{idx + 1}
                  </label>
                  <input
                    type="text"
                    value={verifyAnswers[i]}
                    onChange={(e) => {
                      const updated = [...verifyAnswers];
                      updated[i] = e.target.value;
                      setVerifyAnswers(updated);
                      setVerifyError("");
                    }}
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                    placeholder={`Word #${idx + 1}`}
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 text-sm focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/10 transition-all"
                  />
                </div>
              ))}
            </div>

            {verifyError && (
              <p className="text-sm text-rose-muted mb-4">{verifyError}</p>
            )}

            <button
              onClick={handleVerify}
              className="w-full py-4 rounded-2xl bg-sage text-white font-medium hover:bg-sage-dark transition-colors"
            >
              Confirm & Log In
            </button>
          </div>
        )}

        {/* ── LOGIN ── */}
        {screen === "login" && (
          <div>
            <p className="text-xs font-medium text-sage uppercase tracking-widest mb-2">
              Welcome Back
            </p>
            <h2 className="text-2xl font-serif text-stone-800 mb-2">
              Enter your passphrase.
            </h2>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Paste or type your 12 words, separated by spaces. Your phrase never
              leaves this device.
            </p>

            <textarea
              value={loginPhrase}
              onChange={(e) => {
                setLoginPhrase(e.target.value);
                setLoginError("");
              }}
              placeholder="word1 word2 word3 … word12"
              rows={4}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="w-full border border-stone-200 rounded-2xl px-5 py-4 text-stone-800 text-sm font-mono focus:outline-none focus:border-sage focus:ring-2 focus:ring-sage/10 transition-all mb-1 resize-none"
            />

            {loginError && (
              <p className="text-sm text-rose-muted mb-4">{loginError}</p>
            )}

            <div className="bg-amber/10 border border-amber/25 rounded-2xl p-3 mb-5 flex gap-2">
              <span className="text-amber shrink-0">⚠</span>
              <p className="text-xs text-stone-600">
                We cannot reset your account. Lose the words, lose the data.
              </p>
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-4 rounded-2xl bg-sage text-white font-medium hover:bg-sage-dark transition-colors"
            >
              Unlock My Journal
            </button>

            <button
              onClick={() => setScreen("choose")}
              className="w-full mt-3 py-3 text-sm text-stone-400 hover:text-stone-600 transition-colors"
            >
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
