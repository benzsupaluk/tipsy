import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/backdrop";
import { PlayingCard, type Card } from "../components/playing-card";
import type { Copy } from "../copy";
import { C, condensed } from "../theme";

const TUMBLE: { card: Card; x: number; y: number; r: number; w: number; d: number }[] = [
  { card: { rank: 1, suit: "spades" }, x: 90, y: 1230, r: -22, w: 250, d: 0 },
  { card: { rank: 13, suit: "hearts" }, x: 760, y: 1180, r: 18, w: 260, d: 6 },
  { card: { rank: 7, suit: "diamonds" }, x: 420, y: 1420, r: -6, w: 230, d: 12 },
];

/** 0–2.5s: the pattern interrupt. Short, loud, Thai-first. */
export function Hook({ t }: { t: Copy }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const l1 = spring({ frame: frame - 2, fps, config: { damping: 9, stiffness: 180 } });
  const l2 = spring({ frame: frame - 22, fps, config: { damping: 12 } });
  const thud = interpolate(frame, [2, 6, 12], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <Backdrop intensity={interpolate(frame, [0, 20], [0.3, 1], { extrapolateRight: "clamp" })} />
      <AbsoluteFill style={{ transform: `translateY(${thud * 10}px)` }}>
        {TUMBLE.map((c, i) => {
          const s = spring({ frame: frame - 18 - c.d, fps, config: { damping: 13 } });
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x,
                top: c.y,
                transform: `translateY(${(1 - s) * 900}px) rotate(${c.r + (1 - s) * 40 + Math.sin(frame / 18 + i) * 3}deg)`,
              }}
            >
              <PlayingCard card={c.card} width={c.w} flip={interpolate(s, [0.5, 1], [0, 1], { extrapolateLeft: "clamp" })} />
            </div>
          );
        })}

        <div style={{ position: "absolute", top: 470, left: 60, right: 60, textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              ...condensed,
              fontSize: 150,
              lineHeight: 1.1,
              color: C.bone,
              transform: `scale(${interpolate(l1, [0, 1], [2.2, 1])})`,
              opacity: interpolate(l1, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
              textShadow: "0 10px 60px rgb(0 0 0 / 0.7)",
            }}
          >
            {t.hook[0]}
          </h1>
          <p
            style={{
              margin: "24px 0 0",
              ...condensed,
              fontSize: 92,
              lineHeight: 1.2,
              color: C.amber,
              transform: `translateY(${(1 - l2) * 60}px)`,
              opacity: l2,
              textShadow: "0 0 40px rgb(240 182 74 / 0.35)",
            }}
          >
            {t.hook[1]}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
}
