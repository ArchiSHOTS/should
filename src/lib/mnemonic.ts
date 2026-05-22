import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

export function generateMnemonic(): string {
  return bip39.generateMnemonic(wordlist, 128); // 128 bits = 12 words
}

export function validateMnemonic(phrase: string): boolean {
  return bip39.validateMnemonic(phrase.trim().toLowerCase(), wordlist);
}

export function normalizePhrase(phrase: string): string {
  return phrase.trim().toLowerCase().replace(/\s+/g, " ");
}

export interface VerifyChallenge {
  indices: number[]; // 0-based word positions the user must re-enter
  words: string[];   // the correct answers (for internal validation only)
}

/**
 * Pick 3 random word positions from the 12-word phrase for the verification step.
 */
export function getVerifyChallenge(mnemonic: string): VerifyChallenge {
  const words = mnemonic.split(" ");
  const pool = Array.from({ length: 12 }, (_, i) => i);

  // Fisher-Yates shuffle and take first 3
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  const indices = pool.slice(0, 3).sort((a, b) => a - b);
  return {
    indices,
    words: indices.map((i) => words[i]),
  };
}

export function checkVerification(
  challenge: VerifyChallenge,
  answers: string[]
): boolean {
  return challenge.words.every(
    (word, i) => word === (answers[i] ?? "").trim().toLowerCase()
  );
}
