"use client";

import { useState } from "react";
import { newDeck, type Card } from "./cards";

type State<G> = {
  deck: Card[];
  /** Face-up card the next guess is made against. */
  base: Card;
  /** Revealed card after a guess, null while waiting for a guess. */
  drawn: Card | null;
  choice: G | null;
  round: number;
};

function deal<G>(): State<G> {
  const [base, ...deck] = newDeck();
  return { deck, base, drawn: null, choice: null, round: 0 };
}

/**
 * Shared flow for "guess the next card" games:
 * a card sits face up, the player guesses, the next card is revealed,
 * then the revealed card becomes the new base for the next player.
 * When the deck runs out a fresh 52 is shuffled in.
 */
export function usePredictionDeck<G>() {
  const [s, setS] = useState<State<G>>(deal);

  const guess = (g: G) =>
    setS((prev) => {
      if (prev.drawn) return prev;
      const [drawn, ...deck] = prev.deck;
      return { ...prev, deck, drawn, choice: g };
    });

  const next = () => {
    const freshDeck = newDeck();
    setS((prev) => {
      if (!prev.drawn) return prev;
      const empty = prev.deck.length === 0;
      return {
        deck: empty ? freshDeck : prev.deck,
        base: prev.drawn,
        drawn: null,
        choice: null,
        round: prev.round + 1,
      };
    });
  };

  return { ...s, cardsLeft: s.deck.length, deckEmpty: s.deck.length === 0, guess, next };
}
