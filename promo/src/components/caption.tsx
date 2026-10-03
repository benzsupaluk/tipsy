import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, condensed } from "../theme";

/** Headline above the phone. Sits below Instagram's top bar (~220px). */
export function Caption({ index, headline, sub, lang }: { index: string; headline: string; sub: string; lang: "th" | "en" }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const a = spring({ frame: frame - 4, fps, config: { damping: 14 } });
  const b = spring({ frame: frame - 12, fps, config: { damping: 16 } });

  return (
    <div style={{ position: "absolute", top: 230, left: 80, right: 80, textAlign: "center" }}>
      <p
        style={{
          margin: 0,
          fontFamily: FONT.grotesk,
          fontSize: 30,
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: C.amber,
          opacity: interpolate(a, [0, 1], [0, 1]),
        }}
      >
        {index}
      </p>
      <h2
        style={{
          margin: "6px 0 0",
          ...condensed,
          fontSize: lang === "th" ? 104 : 118,
          lineHeight: lang === "th" ? 1.15 : 0.95,
          color: C.bone,
          transform: `translateY(${(1 - a) * 40}px) scale(${interpolate(a, [0, 1], [1.12, 1])})`,
          opacity: a,
          textShadow: "0 6px 40px rgb(0 0 0 / 0.6)",
        }}
      >
        {headline}
      </h2>
      <p
        style={{
          margin: "10px 0 0",
          fontFamily: FONT.sans,
          fontSize: 44,
          fontWeight: 600,
          color: C.amber,
          transform: `translateY(${(1 - b) * 24}px)`,
          opacity: b,
        }}
      >
        {sub}
      </p>
    </div>
  );
}
