import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { Character } from "../components/app-ui";
import { Backdrop } from "../components/backdrop";
import type { Copy, Lang } from "../copy";
import { C, FONT, condensed, panel } from "../theme";

const CAST: { id: string; x: number; y: number; size: number; d: number }[] = [
  { id: "beer-mug", x: 120, y: 1330, size: 210, d: 30 },
  { id: "margarita", x: 360, y: 1420, size: 190, d: 34 },
  { id: "tequila-shot", x: 590, y: 1350, size: 170, d: 38 },
  { id: "mojito", x: 790, y: 1420, size: 200, d: 42 },
  { id: "whisky-rocks", x: 150, y: 250, size: 150, d: 46 },
  { id: "champagne-flute", x: 820, y: 240, size: 160, d: 50 },
];

/** The why: free, no app, no cards. */
export function Pitch({ t, lang }: { t: Copy; lang: Lang }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const head = spring({ frame, fps, config: { damping: 10, stiffness: 170 } });

  return (
    <AbsoluteFill>
      <Backdrop />
      {CAST.map((c, i) => {
        const s = spring({ frame: frame - c.d, fps, config: { damping: 9 } });
        const bob = Math.sin((frame + i * 9) / 9) * 12;
        return (
          <div key={c.id} style={{ position: "absolute", left: c.x - c.size / 2, top: c.y + bob, transform: `scale(${s}) rotate(${(i % 2 ? 1 : -1) * (8 + bob / 3)}deg)` }}>
            <Character id={c.id} size={c.size} style={{ filter: "drop-shadow(0 20px 30px rgb(0 0 0 / 0.6))" }} />
          </div>
        );
      })}

      <div style={{ position: "absolute", top: 440, left: 90, right: 90 }}>
        <h2
          style={{
            margin: 0,
            ...condensed,
            fontSize: lang === "th" ? 170 : 150,
            lineHeight: 1.05,
            color: C.amber,
            textAlign: "center",
            transform: `scale(${interpolate(head, [0, 1], [1.8, 1])})`,
            opacity: interpolate(head, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
            filter: "drop-shadow(0 0 40px rgb(240 182 74 / 0.3))",
          }}
        >
          {t.pitchTitle}
        </h2>
        <ul style={{ listStyle: "none", margin: "50px 0 0", padding: 0, display: "flex", flexDirection: "column", gap: 22 }}>
          {t.pitch.map((line, i) => {
            const s = spring({ frame: frame - 12 - i * 7, fps, config: { damping: 14 } });
            return (
              <li
                key={line}
                style={{
                  ...panel,
                  display: "flex",
                  alignItems: "center",
                  gap: 26,
                  borderRadius: 34,
                  padding: "28px 34px",
                  fontFamily: FONT.sans,
                  fontSize: 48,
                  fontWeight: 700,
                  color: C.bone,
                  background: "linear-gradient(180deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.03))",
                  transform: `translateX(${(1 - s) * (i % 2 ? 300 : -300)}px)`,
                  opacity: s,
                }}
              >
                <span style={{ display: "grid", placeItems: "center", width: 64, height: 64, flex: "none", borderRadius: 99, background: "rgb(111 211 168 / 0.15)", border: "2px solid rgb(111 211 168 / 0.5)", color: C.safe, fontSize: 36 }}>
                  ✓
                </span>
                {line}
              </li>
            );
          })}
        </ul>
      </div>
    </AbsoluteFill>
  );
}
