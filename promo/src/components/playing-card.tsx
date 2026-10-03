import { C, FONT } from "../theme";

export type Suit = "clubs" | "diamonds" | "hearts" | "spades";
export type Card = { rank: number; suit: Suit };

export const SUIT_SYMBOL: Record<Suit, string> = { clubs: "♣", diamonds: "♦", hearts: "♥", spades: "♠" };

const isRed = (s: Suit) => s === "hearts" || s === "diamonds";
const rankLabel = (r: number) => (r === 1 ? "A" : r === 11 ? "J" : r === 12 ? "Q" : r === 13 ? "K" : String(r));

/**
 * The app's .pcard, driven by a `flip` value instead of CSS transitions:
 * 0 shows the back, 1 shows the face.
 */
export function PlayingCard({
  card,
  width,
  flip = 1,
  style,
}: {
  card: Card | null;
  width: number;
  flip?: number;
  style?: React.CSSProperties;
}) {
  const u = width / 100; // 1cqw
  const red = card ? isRed(card.suit) : false;
  const side: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: 7 * u,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    overflow: "hidden",
  };

  return (
    <div style={{ width, aspectRatio: "5 / 7", perspective: 900 * (width / 170), flex: "none", ...style }}>
      <div
        style={{
          position: "relative",
          height: "100%",
          transformStyle: "preserve-3d",
          transform: `rotateY(${(1 - flip) * 180}deg)`,
        }}
      >
        <div
          style={{
            ...side,
            transform: "rotateY(180deg)",
            border: "1px solid rgb(240 182 74 / 0.45)",
            background: `repeating-linear-gradient(135deg, rgb(255 255 255 / 0.05) 0 ${5 * u}px, transparent ${5 * u}px ${10 * u}px), linear-gradient(160deg, #3a2242, #1e1224)`,
            display: "grid",
            placeItems: "center",
            color: C.amber,
          }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 32 * u,
              aspectRatio: "1",
              borderRadius: "50%",
              border: "1px solid rgb(240 182 74 / 0.6)",
              fontSize: 15 * u,
              lineHeight: 1,
              fontFamily: FONT.sans,
            }}
          >
            ?
          </span>
        </div>
        <div
          style={{
            ...side,
            color: red ? C.suitRed : "#141316",
            background: `linear-gradient(160deg, #ffffff 0%, ${C.cream} 55%, #e9e2d5 100%)`,
            boxShadow: "0 20px 40px -18px rgb(0 0 0 / 0.9)",
          }}
        >
          {card ? <Face card={card} u={u} /> : null}
        </div>
      </div>
    </div>
  );
}

function Face({ card, u }: { card: Card; u: number }) {
  const corner: React.CSSProperties = {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: FONT.grotesk,
    fontWeight: 700,
    fontSize: 17 * u,
    lineHeight: 0.95,
    letterSpacing: "-0.04em",
  };
  const sym = SUIT_SYMBOL[card.suit];
  const label = rankLabel(card.rank);
  return (
    <>
      <span style={{ ...corner, top: 6 * u, left: 8 * u }}>
        {label}
        <i style={{ fontStyle: "normal", fontSize: 12 * u, letterSpacing: 0 }}>{sym}</i>
      </span>
      <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", fontSize: 34 * u, lineHeight: 1 }}>
        {sym}
      </span>
      <span style={{ ...corner, bottom: 6 * u, right: 8 * u, transform: "rotate(180deg)" }}>
        {label}
        <i style={{ fontStyle: "normal", fontSize: 12 * u, letterSpacing: 0 }}>{sym}</i>
      </span>
    </>
  );
}
