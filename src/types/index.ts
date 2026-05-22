export type Context = "professional" | "personal" | "conflict" | "creative";
export type Mood = "calm" | "excited" | "angry" | "sad" | "seeking_validation";
export type Goal =
  | "to_inform"
  | "to_connect"
  | "to_vent"
  | "to_seek_advice"
  | "to_get_revenge";

export type Verdict = "POST" | "HOLD" | "DROP";

export interface TextSignal {
  // Emotional tone flags
  hasAggression: boolean;          // explicit threats, hostile language
  hasProfanity: boolean;           // profanity / slurs
  hasCallout: boolean;             // naming/shaming someone publicly
  hasExcessiveEmphasis: boolean;   // ALL CAPS words, !!!!, ????
  hasFirstPersonGrievance: boolean;// "they always", "you never", "every time"
  hasVenting: boolean;             // venting patterns ("I can't believe", "so sick of")
  hasRevengeLang: boolean;         // "expose", "everyone should know", "deserve to know"
  hasSelfDoubt: boolean;           // "should I even", "am I wrong", "is it just me"
  hasPositiveIntent: boolean;      // "excited to share", "happy to announce", "proud"
  hasCalmReflection: boolean;      // thoughtful, balanced language
  // Scores
  sentimentScore: number;          // -1 (very negative) to +1 (very positive)
  aggressionScore: number;         // 0 (none) to 1 (high) — continuous measure
  // Mood/intent signals that may confirm or contradict self-reported mood
  inferredTone: "hostile" | "negative" | "neutral" | "positive" | "celebratory";
}

export interface AdviceResult {
  verdict: Verdict;
  reason: string;
  holdDuration?: string;
}

export interface InterrogationAnswers {
  context: Context;
  mood: Mood;
  goal: Goal;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  iv: string;
  salt: string;
  ciphertext: string;
  created_at: string;
}

export interface DecryptedEntry {
  id: string;
  created_at: string;
  content: string;
  context: Context;
  mood: Mood;
  goal: Goal;
  advice: AdviceResult;
  timestamp: string;
}

export interface AuthState {
  mnemonic: string;
}
