export type Suit = "clubs" | "diamonds" | "hearts" | "spades";

export type Card = {
  id: string;
  /** 1 = A (lowest) … 13 = K (highest) */
  rank: number;
  suit: Suit;
};

export const SUITS: Suit[] = ["clubs", "diamonds", "hearts", "spades"];

export const SUIT_SYMBOL: Record<Suit, string> = {
  clubs: "♣",
  diamonds: "♦",
  hearts: "♥",
  spades: "♠",
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII"];

export function rankLabel(rank: number): string {
  if (rank === 1) return "A";
  if (rank === 11) return "J";
  if (rank === 12) return "Q";
  if (rank === 13) return "K";
  return String(rank);
}

export function roman(rank: number): string {
  return ROMAN[rank] ?? "";
}

export function isRed(suit: Suit): boolean {
  return suit === "hearts" || suit === "diamonds";
}

function randomInt(max: number): number {
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return buf[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function shuffle<T>(input: readonly T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function newDeck(): Card[] {
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      cards.push({ id: `${rank}-${suit}`, rank, suit });
    }
  }
  return shuffle(cards);
}
