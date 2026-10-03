import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, FONT } from "../theme";

/** A tilted pill that pops onto the canvas at `at`, IG-sticker style. */
export function Sticker({
  at,
  x,
  y,
  rotate = -8,
  tone = "amber",
  children,
}: {
  at: number;
  x: number;
  y: number;
  rotate?: number;
  tone?: "amber" | "hot" | "safe";
  children: React.ReactNode;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - at, fps, config: { damping: 8, stiffness: 200 } });
  if (frame < at) return null;
  const bg = tone === "hot" ? C.hot : tone === "safe" ? C.safe : C.amber;
  const fg = tone === "hot" ? "#fff" : C.ink;
  const wobble = Math.sin((frame - at) / 5) * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        zIndex: 40,
        transform: `translate(-50%, -50%) rotate(${rotate + wobble}deg) scale(${interpolate(s, [0, 1], [0.2, 1])})`,
        opacity: interpolate(s, [0, 0.3], [0, 1], { extrapolateRight: "clamp" }),
        background: bg,
        color: fg,
        fontFamily: FONT.sans,
        fontWeight: 700,
        fontSize: 52,
        padding: "18px 34px",
        borderRadius: 999,
        whiteSpace: "nowrap",
        boxShadow: `0 20px 50px -10px rgb(0 0 0 / 0.7), 0 0 0 6px rgb(255 255 255 / 0.9)`,
      }}
    >
      {children}
    </div>
  );
}
