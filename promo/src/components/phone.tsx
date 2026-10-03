import { spring, useCurrentFrame, useVideoConfig, interpolate } from "remotion";
import { C } from "../theme";

/** Inner screen size in CSS px: the app is laid out for a ~390px-wide phone. */
export const SCREEN_W = 390;
export const SCREEN_H = 700;

/** Rendered phone width on the 1080px canvas. */
const PHONE_W = 560;
const SCALE = PHONE_W / SCREEN_W;
const BEZEL = 12;

/**
 * Phone mockup. Children are laid out in app-native px (390 wide) and scaled up,
 * so app sizes (text-xl = 20px, min-h-17 = 68px) carry over literally.
 */
export function Phone({ top = 470, children, shake = 0 }: { top?: number; children: React.ReactNode; shake?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = spring({ frame, fps, config: { damping: 16, mass: 0.9 } });
  const y = interpolate(enter, [0, 1], [260, 0]);
  const tilt = interpolate(enter, [0, 1], [14, 0]);
  const sx = shake ? Math.sin(frame * 2.1) * shake * 14 : 0;
  const rot = shake ? Math.sin(frame * 1.7) * shake * 1.2 : 0;

  const outerW = PHONE_W + BEZEL * 2;
  const outerH = SCREEN_H * SCALE + BEZEL * 2;

  return (
    <div
      style={{
        position: "absolute",
        left: (1080 - outerW) / 2,
        top,
        width: outerW,
        height: outerH,
        transform: `perspective(2000px) translate(${sx}px, ${y}px) rotateX(${tilt}deg) rotate(${rot}deg)`,
        opacity: interpolate(enter, [0, 0.4], [0, 1], { extrapolateRight: "clamp" }),
        borderRadius: 78,
        padding: BEZEL,
        background: "linear-gradient(145deg, #3a3740, #151418 40%, #2a2830)",
        boxShadow: "0 60px 120px -30px rgb(0 0 0 / 0.9), 0 0 0 2px rgb(255 255 255 / 0.06), 0 0 120px -20px rgb(240 182 74 / 0.25)",
      }}
    >
      <div style={{ position: "relative", width: PHONE_W, height: SCREEN_H * SCALE, borderRadius: 66, overflow: "hidden", background: C.ink }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: SCREEN_W,
            height: SCREEN_H,
            transform: `scale(${SCALE})`,
            transformOrigin: "0 0",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: [
                "radial-gradient(55% 35% at 0% 0%, rgb(120 28 28 / 0.45), transparent 70%)",
                "radial-gradient(55% 35% at 100% 0%, rgb(66 30 92 / 0.45), transparent 70%)",
                "radial-gradient(60% 35% at 0% 100%, rgb(2 123 249 / 0.4), transparent 70%)",
              ].join(", "),
            }}
          />
          {/* Dynamic island */}
          <div style={{ position: "absolute", top: 11, left: "50%", width: 104, height: 30, marginLeft: -52, borderRadius: 20, background: "#000", zIndex: 10 }} />
          {children}
        </div>
      </div>
    </div>
  );
}
