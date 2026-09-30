"use client";

import { isRed, rankLabel, SUIT_SYMBOL, type Card } from "@/lib/cards";
import { useApp } from "@/lib/store";

type Props = {
  card: Card | null;
  faceUp: boolean;
  /** `fill` sizes the card to the nearest `container-type: size` ancestor. */
  size?: "sm" | "md" | "lg" | "fill";
  /** Play the flip when the card mounts already face up. */
  flipIn?: boolean;
  className?: string;
};

export function PlayingCard({ card, faceUp, size = "md", flipIn = false, className = "" }: Props) {
  const up = faceUp && card !== null;
  return (
    <div className={`pcard pcard--${size} ${up ? "is-up" : ""} ${flipIn ? "flip-in" : ""} ${className}`}>
      <div className="pcard__inner">
        <div className="pcard__side pcard__back" aria-hidden={up}>
          <span className="pcard__q">?</span>
        </div>
        <div className={`pcard__side pcard__face ${card && isRed(card.suit) ? "is-red" : ""}`}>
          {card ? <CardFace card={card} /> : null}
        </div>
      </div>
    </div>
  );
}

function CardFace({ card }: { card: Card }) {
  const { t } = useApp();
  const label = rankLabel(card.rank);
  const sym = SUIT_SYMBOL[card.suit];
  return (
    <div role="img" aria-label={`${label} ${t.suits[card.suit]}`} className="absolute inset-0">
      <span className="pcard__corner" aria-hidden="true">
        {label}
        <i>{sym}</i>
      </span>
      <span className="pcard__center" aria-hidden="true">
        {sym}
      </span>
      <span className="pcard__corner pcard__corner--br" aria-hidden="true">
        {label}
        <i>{sym}</i>
      </span>
    </div>
  );
}
