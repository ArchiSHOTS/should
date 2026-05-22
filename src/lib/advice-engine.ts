import type { Context, Mood, Goal, AdviceResult, TextSignal } from "@/types";

// ─────────────────────────────────────────────
// PHASE 1 — Text analysis
// All processing is local; the draft never leaves the browser.
// ─────────────────────────────────────────────

// Word/phrase lists — deliberately broad to catch intent, not just exact words
const AGGRESSION_PHRASES = [
  "i will", "i'll make", "you'll regret", "you'll pay", "i'll destroy",
  "i'll ruin", "watch your back", "you're done", "i'm done with you",
  "come at me", "fight me", "i'll expose", "i'll end you", "you'll see",
  "make you pay", "ruin your", "destroy your",
];

const PROFANITY = [
  "fuck", "shit", "bitch", "asshole", "bastard", "damn", "crap",
  "piss", "dick", "cock", "cunt", "whore", "slut",
];

const CALLOUT_PHRASES = [
  "everyone should know", "the world should know", "needs to know",
  "publicly calling out", "calling out", "exposing", "name and shame",
  "cancel", "should be fired", "should lose their job", "is a fraud",
  "is a liar", "is abusive", "is toxic", "stay away from",
  "warning about", "be warned about",
];

const GRIEVANCE_PHRASES = [
  "they always", "you always", "you never", "they never", "he always",
  "she always", "he never", "she never", "every single time",
  "this always happens", "tired of this", "sick of this", "once again",
  "as usual", "yet again", "here we go again",
];

const VENTING_PHRASES = [
  "i can't believe", "i cannot believe", "unbelievable", "how dare",
  "so frustrated", "so angry", "so upset", "so done", "i've had enough",
  "i hate", "i despise", "drives me crazy", "makes me sick",
  "infuriating", "disgusting", "pathetic", "ridiculous", "absurd",
  "outrageous", "beyond belief",
];

const REVENGE_PHRASES = [
  "expose", "everyone will know", "screenshot", "receipts",
  "deserve what", "karma will", "hope they", "serves them right",
  "get what they deserve", "they'll get theirs", "payback",
  "revenge", "retaliate", "make them pay",
];

const SELF_DOUBT_PHRASES = [
  "should i even", "am i wrong", "is it just me", "maybe i'm overreacting",
  "am i overreacting", "probably stupid", "probably dumb", "no one cares",
  "why do i bother", "what's the point", "does anyone else",
  "is this weird", "am i the only one", "feel like i'm",
];

const POSITIVE_PHRASES = [
  "excited to share", "happy to announce", "proud to", "thrilled to",
  "delighted to", "pleased to share", "grateful for", "thankful for",
  "love this", "amazing", "wonderful", "fantastic", "incredible",
  "so good", "great news", "big news", "milestone", "achievement",
  "launched", "released", "published", "finished", "completed",
];

const CALM_REFLECTION_PHRASES = [
  "i've been thinking", "wanted to share", "reflecting on",
  "thought i'd share", "in my experience", "i believe", "i think",
  "from my perspective", "i've learned", "i've noticed",
  "something i've been", "wanted to write", "worth noting",
];

// Simple positive/negative word lists for sentiment scoring
const POSITIVE_WORDS = new Set([
  "good", "great", "love", "happy", "joy", "wonderful", "amazing",
  "excellent", "fantastic", "beautiful", "brilliant", "awesome",
  "thankful", "grateful", "proud", "excited", "thrilled", "glad",
  "delighted", "pleased", "inspired", "hopeful", "kind", "warm",
  "generous", "brave", "strong", "peaceful", "calm", "growth",
  "progress", "success", "win", "achieve", "celebrate", "proud",
]);

const NEGATIVE_WORDS = new Set([
  "bad", "hate", "angry", "sad", "awful", "terrible", "horrible",
  "disgusting", "pathetic", "stupid", "idiot", "fool", "loser",
  "useless", "worthless", "failed", "failure", "wrong", "liar",
  "fake", "fraud", "toxic", "abuse", "hurt", "pain", "suffer",
  "regret", "bitter", "rage", "furious", "betrayed", "disappointed",
  "frustrated", "annoyed", "upset", "miserable", "broken",
]);

function normalise(text: string): string {
  return text.toLowerCase().replace(/['']/g, "'");
}

function containsAny(text: string, phrases: string[]): boolean {
  return phrases.some((p) => text.includes(p));
}

// Counts consecutive ALL-CAPS words (3+ letters) — a proxy for shouting
function countCapsWords(text: string): number {
  return (text.match(/\b[A-Z]{3,}\b/g) ?? []).length;
}

function countExclamations(text: string): number {
  return (text.match(/!{2,}|\?{3,}/g) ?? []).length;
}

export function analyzeText(draft: string): TextSignal {
  const norm = normalise(draft);
  const words = norm.split(/\s+/).filter(Boolean);
  const wordCount = words.length || 1;

  // --- Boolean flags ---
  const hasAggression = containsAny(norm, AGGRESSION_PHRASES);
  const hasProfanity = containsAny(norm, PROFANITY);
  const hasCallout = containsAny(norm, CALLOUT_PHRASES);
  const hasFirstPersonGrievance = containsAny(norm, GRIEVANCE_PHRASES);
  const hasVenting = containsAny(norm, VENTING_PHRASES);
  const hasRevengeLang = containsAny(norm, REVENGE_PHRASES);
  const hasSelfDoubt = containsAny(norm, SELF_DOUBT_PHRASES);
  const hasPositiveIntent = containsAny(norm, POSITIVE_PHRASES);
  const hasCalmReflection = containsAny(norm, CALM_REFLECTION_PHRASES);
  const hasExcessiveEmphasis =
    countCapsWords(draft) >= 3 || countExclamations(draft) >= 2;

  // --- Sentiment score (-1 to +1) ---
  let posCount = 0;
  let negCount = 0;
  for (const word of words) {
    const bare = word.replace(/[^a-z]/g, "");
    if (POSITIVE_WORDS.has(bare)) posCount++;
    if (NEGATIVE_WORDS.has(bare)) negCount++;
  }
  const sentimentScore =
    wordCount > 0 ? (posCount - negCount) / Math.max(1, posCount + negCount || 1) : 0;
  const normalizedSentiment = Math.max(-1, Math.min(1, sentimentScore));

  // --- Aggression score (0 to 1) ---
  const aggressionFactors = [
    hasAggression ? 0.4 : 0,
    hasProfanity ? 0.25 : 0,
    hasCallout ? 0.2 : 0,
    hasExcessiveEmphasis ? 0.1 : 0,
    hasRevengeLang ? 0.3 : 0,
  ];
  const aggressionScore = Math.min(1, aggressionFactors.reduce((a, b) => a + b, 0));

  // --- Inferred tone ---
  let inferredTone: TextSignal["inferredTone"];
  if (aggressionScore >= 0.5 || hasAggression || hasRevengeLang) {
    inferredTone = "hostile";
  } else if (negCount > posCount * 2 || hasVenting || hasFirstPersonGrievance) {
    inferredTone = "negative";
  } else if (hasPositiveIntent || normalizedSentiment > 0.3) {
    inferredTone = "celebratory";
  } else if (normalizedSentiment > 0 || hasCalmReflection) {
    inferredTone = "positive";
  } else {
    inferredTone = "neutral";
  }

  return {
    hasAggression,
    hasProfanity,
    hasCallout,
    hasExcessiveEmphasis,
    hasFirstPersonGrievance,
    hasVenting,
    hasRevengeLang,
    hasSelfDoubt,
    hasPositiveIntent,
    hasCalmReflection,
    sentimentScore: normalizedSentiment,
    aggressionScore,
    inferredTone,
  };
}

// ─────────────────────────────────────────────
// PHASE 2 — Combined verdict engine
// Text signals are primary; mood/context/goal act as supporting context.
// ─────────────────────────────────────────────

export function getAdvice(
  draft: string,
  context: Context,
  mood: Mood,
  goal: Goal
): AdviceResult {
  const t = analyzeText(draft);

  // ── HARD DROP — text itself is the primary trigger ──────────────────

  if (t.hasAggression && t.hasCallout) {
    return {
      verdict: "DROP",
      reason:
        "This post contains both aggressive language and a direct callout. Regardless of how justified you feel, publishing this will almost certainly cause lasting damage — to the situation, the relationship, and your own reputation. Let it go.",
    };
  }

  if (t.hasRevengeLang && (t.hasCallout || context === "conflict")) {
    return {
      verdict: "DROP",
      reason:
        "The language here reads like a public strike against someone. Revenge through a post rarely achieves resolution — it usually escalates, gets screenshot, and outlasts the moment. This one is better left unsent.",
    };
  }

  if (t.aggressionScore >= 0.6) {
    return {
      verdict: "DROP",
      reason:
        "The tone of this draft is highly aggressive. Even if every word is true, the delivery will overshadow the message and put you on the defensive. Write it down privately — but don't post it.",
    };
  }

  if (t.hasCallout && context === "conflict") {
    return {
      verdict: "DROP",
      reason:
        "Calling someone out publicly in the middle of a conflict almost never leads to the outcome you want. It tends to harden positions and remove any chance of a quiet resolution.",
    };
  }

  // ── HARD DROP — mood/goal combination confirms intent ───────────────

  if (mood === "angry" && goal === "to_get_revenge") {
    return {
      verdict: "DROP",
      reason:
        "Anger plus a desire to retaliate is the most dangerous combination for a social post. You're in a state where consequences feel abstract. They aren't. Sleep, then decide.",
    };
  }

  if (context === "conflict" && mood === "angry" && t.inferredTone !== "positive") {
    return {
      verdict: "DROP",
      reason:
        "You're writing about a conflict while feeling angry, and the text confirms it. This is the exact situation where a post causes more damage than it solves. Give it a day.",
    };
  }

  // ── HOLD — text signals problems the user may not have self-reported ─

  if (t.inferredTone === "hostile" && mood !== "angry") {
    return {
      verdict: "HOLD",
      reason:
        "The tone of your writing reads as hostile, even if that's not how you feel right now. Your words may land harder than you intend. Read it aloud to yourself before deciding.",
      holdDuration: "1 hour",
    };
  }

  if (t.hasCallout && mood !== "angry") {
    return {
      verdict: "HOLD",
      reason:
        "This post names or implies a specific person in a negative light. Even unintentionally, callout posts can spiral. Ask yourself: what outcome do you actually want?",
      holdDuration: "2 hours",
    };
  }

  if (t.hasVenting && t.hasFirstPersonGrievance) {
    return {
      verdict: "HOLD",
      reason:
        "This reads like venting — 'they always', 'you never' patterns often appear when we're processing pain, not communicating. A journal or a trusted friend may serve you better right now.",
      holdDuration: "2 hours",
    };
  }

  if (t.hasExcessiveEmphasis && (mood === "angry" || mood === "sad")) {
    return {
      verdict: "HOLD",
      reason:
        "The all-caps and punctuation in this draft signal high emotional intensity. That energy will be visible to readers and may not be how you want to be perceived.",
      holdDuration: "1 hour",
    };
  }

  if (t.hasProfanity && context === "professional") {
    return {
      verdict: "HOLD",
      reason:
        "Strong language in a professional context carries real risk — colleagues, clients, and future employers may see this. Consider whether the words are serving your actual goal.",
      holdDuration: "24 hours",
    };
  }

  // ── HOLD — self-reported mood/goal signals ───────────────────────────

  if (mood === "angry") {
    return {
      verdict: "HOLD",
      reason:
        "You've flagged that you're angry. The text doesn't show extreme aggression, but anger still narrows perspective in ways that are hard to notice from inside it. Give this 24 hours.",
      holdDuration: "24 hours",
    };
  }

  if (mood === "sad" || t.sentimentScore < -0.4) {
    return {
      verdict: "HOLD",
      reason:
        "Sadness colours everything we write, often in ways we don't recognise until later. What you share while hurting may not reflect who you are when you're whole again.",
      holdDuration: "48 hours",
    };
  }

  if (mood === "seeking_validation" && t.hasSelfDoubt) {
    return {
      verdict: "HOLD",
      reason:
        "The text itself reflects uncertainty — phrases like 'is it just me?' or 'am I wrong?' suggest you may be looking for external reassurance. Ask yourself: would you post this if you knew no one would respond?",
      holdDuration: "1 hour",
    };
  }

  if (mood === "seeking_validation") {
    return {
      verdict: "HOLD",
      reason:
        "Posting for validation places your sense of worth in others' responses. Before posting, sit with the question: what does it mean about you if no one reacts?",
      holdDuration: "1 hour",
    };
  }

  if (goal === "to_vent") {
    return {
      verdict: "HOLD",
      reason:
        "Venting publicly can feel like relief in the moment, but the post will outlast the feeling. Consider a private outlet — this journal, a voice note, or a trusted person.",
      holdDuration: "2 hours",
    };
  }

  if (goal === "to_get_revenge") {
    return {
      verdict: "HOLD",
      reason:
        "Revenge posts rarely land the way we imagine. The internet keeps receipts on both sides. Sleep on this.",
      holdDuration: "48 hours",
    };
  }

  if (context === "conflict" && mood !== "calm") {
    return {
      verdict: "HOLD",
      reason:
        "Posting about an unresolved conflict rarely helps resolve it — and may make reconciliation much harder. A direct conversation is almost always more effective.",
      holdDuration: "24 hours",
    };
  }

  // ── POST — text and intent are both constructive ─────────────────────

  if (
    t.inferredTone === "celebratory" &&
    (mood === "excited" || mood === "calm") &&
    (goal === "to_inform" || goal === "to_connect")
  ) {
    return {
      verdict: "POST",
      reason:
        "The writing is positive and energetic, and your intent is to share or connect. This is exactly the kind of content that adds value. Go for it.",
    };
  }

  if (
    t.hasCalmReflection &&
    mood === "calm" &&
    (goal === "to_inform" || goal === "to_connect" || goal === "to_seek_advice")
  ) {
    return {
      verdict: "POST",
      reason:
        "You're writing from a grounded, reflective place with a constructive purpose. This is thoughtful communication — post it.",
    };
  }

  if (
    context === "professional" &&
    (mood === "calm" || mood === "excited") &&
    (goal === "to_inform" || goal === "to_connect") &&
    t.aggressionScore < 0.1 &&
    t.inferredTone !== "negative"
  ) {
    return {
      verdict: "POST",
      reason:
        "Clear head, professional context, constructive goal — and the text confirms it. This is worth sharing.",
    };
  }

  if (
    context === "creative" &&
    t.inferredTone !== "hostile" &&
    (goal === "to_inform" || goal === "to_connect" || goal === "to_seek_advice")
  ) {
    return {
      verdict: "POST",
      reason:
        "Sharing creative work from a grounded place is a genuine contribution. The world benefits from your perspective.",
    };
  }

  if (
    t.inferredTone === "positive" &&
    t.aggressionScore < 0.15 &&
    !t.hasVenting &&
    !t.hasFirstPersonGrievance
  ) {
    return {
      verdict: "POST",
      reason:
        "The text reads as calm and constructive, and there are no strong warning signals. This looks like something worth saying.",
    };
  }

  // ── DEFAULT HOLD ─────────────────────────────────────────────────────
  return {
    verdict: "HOLD",
    reason:
      "When in doubt, hold. There is no cost to waiting, but a potentially lasting cost to impulsive posting. Let this breathe and revisit with fresh eyes.",
    holdDuration: "2 hours",
  };
}
