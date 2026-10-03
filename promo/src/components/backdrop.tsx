import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { C } from "../theme";

/** The app's .glow bar lighting, drifting slowly, with faint suit glyphs floating up. */
export function Backdrop({ glyphs = true, intensity = 1 }: { glyphs?: boolean; intensity?: number }) {
  const frame = useCurrentFrame();
  const drift = Math.sin(frame / 40) * 6;

  return (
    <AbsoluteFill style={{ background: C.ink, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          opacity: intensity,
          background: [
            `radial-gradient(60% 32% at ${0 + drift}% 0%, rgb(120 28 28 / 0.55), transparent 70%)`,
            `radial-gradient(60% 32% at ${100 - drift}% 4%, rgb(66 30 92 / 0.55), transparent 70%)`,
            `radial-gradient(70% 32% at ${drift}% 100%, rgb(2 123 249 / 0.4), transparent 70%)`,
          ].join(", "),
        }}
      />
      {glyphs ? <Glyphs frame={frame} /> : null}
      {/* Vignette keeps edges dark where Instagram draws its UI. */}
      <AbsoluteFill style={{ background: "radial-gradient(120% 80% at 50% 50%, transparent 55%, rgb(0 0 0 / 0.55))" }} />
    </AbsoluteFill>
  );
}

const SYMBOLS = ["♠", "♥", "♦", "♣"];

function Glyphs({ frame }: { frame: number }) {
  return (
    <>
      {Array.from({ length: 14 }, (_, i) => {
        const x = random(`x${i}`) * 1080;
        const speed = 0.6 + random(`s${i}`) * 1.2;
        const size = 40 + random(`z${i}`) * 90;
        const y = 1920 + 200 - ((random(`y${i}`) * 2200 + frame * speed * 3) % 2300);
        const sym = SYMBOLS[i % 4];
        const red = sym === "♥" || sym === "♦";
        return (
          <span
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              fontSize: size,
              lineHeight: 1,
              color: red ? C.suitRed : C.bone,
              opacity: interpolate(size, [40, 130], [0.05, 0.12]),
              transform: `rotate(${(random(`r${i}`) - 0.5) * 60 + frame * 0.2 * (i % 2 ? 1 : -1)}deg)`,
              filter: size < 70 ? "blur(1px)" : undefined,
            }}
          >
            {sym}
          </span>
        );
      })}
    </>
  );
}
