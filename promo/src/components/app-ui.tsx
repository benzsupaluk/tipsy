import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT, easeSoft, panel } from "../theme";

/**
 * Hand-built copies of the app's game screen pieces (components/game-shell.tsx,
 * components/games/*). Sizes are app-native px; the Phone scales them.
 */

export function ScreenPad({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", inset: 0, padding: "52px 20px 20px", display: "flex", flexDirection: "column", fontFamily: FONT.sans, color: C.bone }}>
      {children}
    </div>
  );
}

export function GameTop({ name, rules, endGame }: { name: string; rules: string; endGame: string }) {
  return (
    <div style={{ display: "flex", minHeight: 48, alignItems: "center", justifyContent: "space-between" }}>
      <span
        style={{
          display: "inline-flex",
          height: 28,
          alignItems: "center",
          borderRadius: 999,
          border: "1px solid rgb(240 182 74 / 0.5)",
          background: "rgb(240 182 74 / 0.2)",
          padding: "0 12px",
          fontSize: 11,
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.16em",
          color: C.amber,
        }}
      >
        {name}
      </span>
      <span style={{ display: "flex", gap: 22, fontSize: 14, color: C.mute, paddingRight: 4 }}>
        <span>{rules}</span>
        <span>{endGame}</span>
      </span>
    </div>
  );
}

export function PlayerRow({ name, icon, next, nextIcon, passLabel, active }: { name: string; icon: string; next: string; nextIcon: string; passLabel: string; active: boolean }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 8 }}>
        <Character id={icon} size={52} />
        <h1 style={{ margin: 0, fontFamily: FONT.display, fontSize: 36, lineHeight: 1.2, fontWeight: 700 }}>{name}</h1>
      </div>
      <div style={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
        <span
          style={{
            display: "flex",
            minHeight: 40,
            alignItems: "center",
            gap: 6,
            borderRadius: 999,
            border: "1px solid rgb(240 182 74 / 0.6)",
            background: "rgb(240 182 74 / 0.1)",
            padding: "0 12px 0 8px",
            fontSize: 14,
            fontWeight: 600,
            color: C.amber,
            opacity: active ? 1 : 0.5,
          }}
        >
          <Character id={nextIcon} size={22} />
          {passLabel} →
        </span>
      </div>
    </>
  );
}

export function Character({ id, size, style }: { id: string; size: number; style?: React.CSSProperties }) {
  return <Img src={staticFile(`images/characters/${id}.webp`)} style={{ width: size, height: size, objectFit: "contain", flex: "none", ...style }} />;
}

/** Pinned bottom action area, as in Screen's sticky action bar. */
export function Actions({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "32px 20px 26px", fontFamily: FONT.sans, color: C.bone, background: `linear-gradient(to top, ${C.ink} 70%, transparent)` }}>
      {children}
    </div>
  );
}

export function Question({ children }: { children: React.ReactNode }) {
  return <p style={{ margin: "0 0 12px", textAlign: "center", fontSize: 14, color: C.mute }}>{children}</p>;
}

/** Press feedback: scale-[0.97] plus amber border while `pressed`. */
export function pressStyle(pressed: number): React.CSSProperties {
  return { transform: `scale(${1 - 0.03 * pressed})`, borderColor: pressed > 0.5 ? C.amber : undefined };
}

export function DirectionButton({ label, arrow, pressed = 0 }: { label: string; arrow: "up" | "down"; pressed?: number }) {
  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        minHeight: 64,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        border: "1px solid rgb(240 182 74 / 0.55)",
        background: "linear-gradient(to right, #2e2a1a, #1a1913)",
        boxShadow: pressed ? "0 0 0 3px rgb(240 182 74 / 0.35)" : "inset 0 1px 0 rgb(255 255 255 / 0.04)",
        ...pressStyle(pressed),
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 700 }}>{label}</span>
      <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke={C.amber} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={{ position: "absolute", right: 16 }}>
        <path d={arrow === "up" ? "m18 15-6-6-6 6" : "m6 9 6 6 6-6"} />
      </svg>
    </div>
  );
}

export function PanelButton({ children, pressed = 0, style }: { children: React.ReactNode; pressed?: number; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        ...panel,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 16,
        boxShadow: pressed ? "0 0 0 3px rgb(240 182 74 / 0.35)" : undefined,
        ...pressStyle(pressed),
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        minHeight: 64,
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        borderRadius: 999,
        background: C.amber,
        color: C.ink,
        fontSize: 20,
        fontWeight: 700,
        boxShadow: "0 12px 32px -12px rgb(240 182 74 / 0.7)",
      }}
    >
      {children}
    </div>
  );
}

/** OutcomeBanner from game-shell.tsx: "safe" pops in, "drink" blows up and shakes. */
export function Outcome({ tone, text, detail, start }: { tone: "safe" | "drink"; text: string; detail: string; start: number }) {
  const frame = useCurrentFrame() - start;
  const { fps } = useVideoConfig();
  if (frame < 0) return null;

  if (tone === "safe") {
    const s = spring({ frame, fps, config: { damping: 11 } });
    return (
      <div
        style={{
          borderRadius: 16,
          border: "1px solid rgb(111 211 168 / 0.35)",
          background: "rgb(111 211 168 / 0.08)",
          padding: "16px 18px",
          textAlign: "center",
          transform: `scale(${interpolate(s, [0, 1], [0.9, 1])})`,
          opacity: interpolate(s, [0, 0.5], [0, 1], { extrapolateRight: "clamp" }),
        }}
      >
        <p style={{ margin: 0, fontSize: 24, fontWeight: 700, color: C.safe }}>✓ {text}</p>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: C.mute }}>{detail}</p>
      </div>
    );
  }

  // The app's `boom` keyframes, sampled per frame (0.6s).
  const t = Math.min(frame / (0.6 * fps), 1);
  const scale = interpolate(t, [0, 0.18, 0.3, 1], [0.6, 1.08, 0.98, 1]);
  const shakeX = interpolate(t, [0.3, 0.42, 0.54, 0.66, 0.78, 1], [-6, 5, -4, 3, -1, 0], { extrapolateLeft: "clamp" });
  const bright = interpolate(t, [0, 0.18, 0.3, 1], [3, 2, 1.2, 1]);
  const heat = 0.45 + 0.2 * Math.sin((frame / fps) * Math.PI * 1.25);
  return (
    <div
      style={{
        position: "relative",
        borderRadius: 16,
        border: `2px solid ${C.hot}`,
        background: "radial-gradient(at 20% 50%, rgb(255 59 48 / 0.45), rgb(179 18 27 / 0.3), rgb(58 10 14 / 0.6))",
        padding: "16px 18px",
        textAlign: "center",
        transform: `translateX(${shakeX}px) scale(${scale})`,
        filter: `brightness(${bright})`,
        opacity: interpolate(t, [0, 0.12], [0, 1], { extrapolateRight: "clamp" }),
        boxShadow: `0 0 ${24 + heat * 20}px ${heat * 6}px rgb(255 59 48 / ${heat}), inset 0 0 28px rgb(255 59 48 / 0.25)`,
      }}
    >
      <p style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", textShadow: "0 0 8px rgb(255 59 48 / 0.8)" }}>💥 {text}</p>
      <p style={{ margin: "4px 0 0", fontSize: 14, color: "rgb(255 255 255 / 0.75)" }}>{detail}</p>
    </div>
  );
}

/** A finger-tap ripple at (x, y) in screen px. */
export function Tap({ x, y, at }: { x: number; y: number; at: number }) {
  const frame = useCurrentFrame() - at;
  if (frame < -8 || frame > 18) return null;
  const approach = interpolate(frame, [-8, 0], [0, 1], { extrapolateRight: "clamp", easing: easeSoft });
  const ring = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp" });
  return (
    <div style={{ position: "absolute", left: x, top: y, zIndex: 30, pointerEvents: "none" }}>
      <div
        style={{
          position: "absolute",
          width: 44,
          height: 44,
          marginLeft: -22,
          marginTop: -22,
          borderRadius: "50%",
          background: "rgb(255 255 255 / 0.55)",
          border: "2px solid rgb(255 255 255 / 0.9)",
          transform: `scale(${frame < 0 ? interpolate(approach, [0, 1], [1.6, 1]) : interpolate(ring, [0, 0.3], [1, 0.8], { extrapolateRight: "clamp" })})`,
          opacity: frame < 0 ? approach * 0.9 : interpolate(ring, [0.4, 1], [0.9, 0], { extrapolateLeft: "clamp" }),
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 44,
          height: 44,
          marginLeft: -22,
          marginTop: -22,
          borderRadius: "50%",
          border: `3px solid ${C.amber}`,
          transform: `scale(${1 + ring * 1.8})`,
          opacity: frame < 0 ? 0 : 1 - ring,
        }}
      />
    </div>
  );
}

/** 0 → 1 → 0 over a press starting at `at`. */
export function pressAt(frame: number, at: number) {
  return interpolate(frame, [at, at + 2, at + 6, at + 9], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

/** Card flip value, 0 → 1 over `dur` frames with the app's ease. */
export function flipAt(frame: number, at: number, dur = 18) {
  return interpolate(frame, [at, at + dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeSoft });
}

/** The app's `rise` keyframe: fade up 12px. */
export function rise(frame: number, at: number, dist = 12): React.CSSProperties {
  const p = interpolate(frame, [at, at + 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: easeSoft });
  return { opacity: p, transform: `translateY(${(1 - p) * dist}px)` };
}
