import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Backdrop } from "../components/backdrop";
import { PlayingCard, type Card } from "../components/playing-card";
import type { Copy } from "../copy";
import { C, FONT, condensed } from "../theme";

const FAN: Card[] = [
  { rank: 1, suit: "spades" },
  { rank: 13, suit: "hearts" },
  { rank: 7, suit: "diamonds" },
  { rank: 12, suit: "clubs" },
];

/** TIPSY logo reveal over a fanning hand of cards. Also used (frozen) as the Reel cover. */
export function Brand({ t, games }: { t: Copy; games?: string[] }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fan = spring({ frame: frame - 2, fps, config: { damping: 14 } });
  const tag = spring({ frame: frame - 20, fps, config: { damping: 16 } });
  const glow = 0.25 + 0.12 * Math.sin(frame / 8);

  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", left: 540, top: 1260 }}>
        {FAN.map((c, i) => {
          const angle = (i - (FAN.length - 1) / 2) * 16 * fan;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: -130,
                top: -182,
                transformOrigin: "50% 140%",
                transform: `rotate(${angle}deg) translateY(${(1 - fan) * 300}px)`,
              }}
            >
              <PlayingCard card={c} width={260} flip={interpolate(fan, [0.3, 1], [0, 1], { extrapolateLeft: "clamp" })} />
            </div>
          );
        })}
      </div>

      <div style={{ position: "absolute", top: 330, left: 0, right: 0, textAlign: "center" }}>
        <h1 style={{ margin: 0, ...condensed, fontSize: 330, lineHeight: 0.82, color: C.amber, filter: `drop-shadow(0 0 60px rgb(240 182 74 / ${glow}))` }}>
          {"TIPSY".split("").map((ch, i) => {
            const s = spring({ frame: frame - i * 3, fps, config: { damping: 10, stiffness: 160 } });
            return (
              <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * 180}px) rotate(${(1 - s) * (i % 2 ? 12 : -12)}deg)`, opacity: s }}>
                {ch}
              </span>
            );
          })}
        </h1>
        <p
          style={{
            margin: "44px 0 0",
            display: "inline-flex",
            alignItems: "center",
            gap: 22,
            fontFamily: FONT.sans,
            fontSize: 54,
            fontWeight: 700,
            color: C.bone,
            opacity: tag,
            transform: `translateY(${(1 - tag) * 30}px)`,
          }}
        >
          <span style={{ width: 22, height: 22, borderRadius: 99, background: C.amber, boxShadow: `0 0 0 ${8 + Math.sin(frame / 6) * 6}px rgb(240 182 74 / 0.25)` }} />
          {t.brandTag}
        </p>
        <p style={{ margin: "14px 0 0", fontFamily: FONT.sans, fontSize: 38, color: C.mute, opacity: tag }}>{t.brandLine}</p>
        {games ? (
          <p style={{ margin: "28px 0 0", fontFamily: FONT.sans, fontSize: 34, fontWeight: 600, color: C.amber, opacity: tag }}>{games.join("  ·  ")}</p>
        ) : null}
      </div>
    </AbsoluteFill>
  );
}
