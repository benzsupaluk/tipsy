import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../components/app-ui";
import { Backdrop } from "../components/backdrop";
import type { Copy } from "../copy";
import { C, FONT, condensed } from "../theme";

const ROW = ["beer-mug", "margarita", "tequila-shot", "red-wine", "mojito"];

/** End card: logo, URL, where to find the link. Holds long enough to read. */
export function Cta({ t }: { t: Copy }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const logo = spring({ frame, fps, config: { damping: 12 } });
  const url = spring({ frame: frame - 14, fps, config: { damping: 13 } });
  const hint = spring({ frame: frame - 26, fps, config: { damping: 16 } });
  const pulse = 1 + Math.max(0, Math.sin((frame - 30) / 7)) * 0.03;
  const typed = Math.round(interpolate(frame, [16, 40], [0, t.ctaUrl.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));

  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: "absolute", top: 400, left: 0, right: 0, textAlign: "center" }}>
        <h1
          style={{
            margin: 0,
            ...condensed,
            fontSize: 300,
            lineHeight: 0.82,
            color: C.amber,
            transform: `scale(${interpolate(logo, [0, 1], [0.6, 1])})`,
            opacity: logo,
            filter: `drop-shadow(0 0 ${50 + Math.sin(frame / 8) * 20}px rgb(240 182 74 / 0.3))`,
          }}
        >
          TIPSY
        </h1>
        <p style={{ margin: "40px 0 0", fontFamily: FONT.sans, fontSize: 56, fontWeight: 700, color: C.bone, opacity: logo }}>{t.ctaLine}</p>

        <div
          style={{
            margin: "56px auto 0",
            display: "inline-flex",
            alignItems: "center",
            gap: 20,
            borderRadius: 999,
            background: C.amber,
            color: C.ink,
            padding: "30px 60px",
            fontFamily: FONT.grotesk,
            fontSize: 70,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            boxShadow: "0 30px 80px -20px rgb(240 182 74 / 0.75)",
            transform: `translateY(${(1 - url) * 80}px) scale(${pulse})`,
            opacity: url,
          }}
        >
          <svg width={58} height={58} viewBox="0 0 24 24" fill="none" stroke={C.ink} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span style={{ minWidth: 470, textAlign: "left" }}>
            {t.ctaUrl.slice(0, typed)}
            <span style={{ opacity: typed < t.ctaUrl.length || Math.floor(frame / 10) % 2 ? 1 : 0 }}>|</span>
          </span>
        </div>

        <p style={{ margin: "40px 0 0", fontFamily: FONT.sans, fontSize: 44, fontWeight: 600, color: C.mute, opacity: hint, transform: `translateY(${(1 - hint) * 20}px)` }}>
          {t.ctaHint} 👆
        </p>
      </div>

      <div style={{ position: "absolute", top: 1330, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 18 }}>
        {ROW.map((id, i) => {
          const s = spring({ frame: frame - 20 - i * 4, fps, config: { damping: 8 } });
          const hop = Math.abs(Math.sin((frame + i * 6) / 7)) * -26;
          return (
            <div key={id} style={{ transform: `translateY(${(1 - s) * 200 + hop}px)`, opacity: s }}>
              <Character id={id} size={160} style={{ filter: "drop-shadow(0 16px 24px rgb(0 0 0 / 0.6))" }} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}
