"use client";

import { useEffect, useState } from "react";
import { decrypt } from "@/lib/crypto";
import { hashUserId } from "@/lib/crypto";
import type { AuthState, DecryptedEntry, JournalEntry } from "@/types";
import { CheckIcon, PauseIcon, XIcon, LeafIcon, ChevronDownIcon } from "@/components/Icons";

const verdictColors = {
  POST: "text-sage bg-sage/10 border-sage/25",
  HOLD: "text-amber bg-amber/10 border-amber/25",
  DROP: "text-rose-muted bg-rose-muted/10 border-rose-muted/25",
};

const verdictIcons = {
  POST: <CheckIcon size={11} />,
  HOLD: <PauseIcon size={11} />,
  DROP: <XIcon size={11} />,
};

const moodLabels: Record<string, string> = {
  calm: "Calm",
  excited: "Excited",
  angry: "Angry",
  sad: "Sad",
  seeking_validation: "Seeking Validation",
};

const contextLabels: Record<string, string> = {
  professional: "Professional",
  personal: "Personal",
  conflict: "Conflict",
  creative: "Creative",
};

interface GrowthGalleryProps {
  auth: AuthState;
}

export default function GrowthGallery({ auth }: GrowthGalleryProps) {
  const [entries, setEntries] = useState<DecryptedEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const userId = await hashUserId(auth.mnemonic);
        const res = await fetch(`/api/journal?userId=${userId}`);
        if (!res.ok) throw new Error("Failed to load entries");

        const { entries: raw } = (await res.json()) as { entries: JournalEntry[] };

        const decrypted = await Promise.all(
          raw.map(async (entry) => {
            const payload = await decrypt<Omit<DecryptedEntry, "id" | "created_at">>(
              auth.mnemonic,
              entry.iv,
              entry.salt,
              entry.ciphertext
            );
            return {
              id: entry.id,
              created_at: entry.created_at,
              ...payload,
            } as DecryptedEntry;
          })
        );

        setEntries(decrypted);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    })();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-8 h-8 rounded-full border-2 border-sage border-t-transparent animate-spin" />
        <p className="text-sm text-stone-400">Decrypting your journal…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-rose-muted mb-2">Could not load entries</p>
        <p className="text-sm text-stone-400">{error}</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="flex justify-center mb-4 text-sage"><LeafIcon size={40} /></div>
        <h3 className="text-xl font-serif text-stone-700 mb-2">Your gallery is empty.</h3>
        <p className="text-sm text-stone-400 max-w-xs mx-auto leading-relaxed">
          Thoughts you save during the advice flow will appear here, fully
          decrypted — only for your eyes.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {entries.map((entry) => {
        const isExpanded = expandedId === entry.id;
        const config = verdictColors[entry.advice.verdict];

        return (
          <article
            key={entry.id}
            className="bg-white/60 border border-stone-100 rounded-2xl overflow-hidden hover:shadow-sm transition-shadow duration-200"
          >
            <button
              onClick={() => setExpandedId(isExpanded ? null : entry.id)}
              className="w-full text-left p-5"
            >
              <div className="flex items-start gap-4">
                {/* Verdict badge */}
                <span
                  className={`shrink-0 mt-0.5 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${config}`}
                >
                  <span>{verdictIcons[entry.advice.verdict]}</span>
                  {entry.advice.verdict}
                </span>

                {/* Preview */}
                <div className="flex-1 min-w-0">
                  <p className="text-stone-700 text-sm leading-relaxed line-clamp-2">
                    {entry.content}
                  </p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                    <span>{contextLabels[entry.context]}</span>
                    <span>·</span>
                    <span>{moodLabels[entry.mood]}</span>
                    <span>·</span>
                    <span>
                      {new Date(entry.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <ChevronDownIcon
                  size={14}
                  className={`text-stone-300 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {/* Expanded view */}
            {isExpanded && (
              <div className="px-5 pb-5 border-t border-stone-100 pt-4">
                <p className="text-stone-700 leading-relaxed mb-5">{entry.content}</p>

                <div className={`rounded-xl border p-4 ${config} mb-4`}>
                  <p className="text-xs font-medium uppercase tracking-wider mb-1">
                    Advice given
                  </p>
                  <p className="text-sm leading-relaxed">{entry.advice.reason}</p>
                  {entry.advice.holdDuration && (
                    <p className="text-xs mt-2 opacity-70">
                      Suggested wait: {entry.advice.holdDuration}
                    </p>
                  )}
                </div>

                <div className="flex gap-4 text-xs text-stone-400">
                  <span>Context: {contextLabels[entry.context]}</span>
                  <span>Mood: {moodLabels[entry.mood]}</span>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
