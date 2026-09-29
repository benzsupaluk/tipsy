import type { Card, Suit } from "./cards";

export type LadderGuess = "higher" | "equal" | "lower";

/**
 * - higher/lower correct (strictly) → win, no drink
 * - higher/lower wrong, or the ranks are equal → guesser drinks 1
 * - equal and it hits → everyone except the guesser drinks
 * - equal and it misses → guesser drinks 2
 */
export type LadderResult = "win" | "drink1" | "everyoneElse" | "drink2";

export function ladderResult(base: Card, next: Card, guess: LadderGuess): LadderResult {
  const diff = next.rank - base.rank;
  if (guess === "equal") return diff === 0 ? "everyoneElse" : "drink2";
  if (diff === 0) return "drink1";
  const hit = guess === "higher" ? diff > 0 : diff < 0;
  return hit ? "win" : "drink1";
}

export function suitResult(next: Card, guess: Suit): "win" | "drink1" {
  return next.suit === guess ? "win" : "drink1";
}
