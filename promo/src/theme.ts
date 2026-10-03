import { Easing } from "remotion";

/** Mirrors the @theme tokens in app/globals.css so the video matches the app. */
export const C = {
  ink: "#0b0a0c",
  surface: "#161518",
  raised: "#1d1c20",
  line: "rgb(255 255 255 / 0.09)",
  bone: "#f4efe6",
  mute: "#8e8a94",
  amber: "#f0b64a",
  amberDeep: "#c98d25",
  plum: "#2b1a33",
  cream: "#f7f2e9",
  suitRed: "#d8323c",
  safe: "#6fd3a8",
  danger: "#ff6b6b",
  hot: "#ff3b30",
};

export const FONT = {
  display: "Archivo, Anuphan, sans-serif",
  sans: "'Space Grotesk', Anuphan, sans-serif",
  grotesk: "'Space Grotesk', sans-serif",
};

/** Same curve as --ease-soft. */
export const easeSoft = Easing.bezier(0.22, 1, 0.36, 1);

/** The app's `font-condensed` utility. */
export const condensed: React.CSSProperties = {
  fontFamily: FONT.display,
  fontStretch: "72%",
  fontWeight: 800,
  letterSpacing: "-0.02em",
};

export const panel: React.CSSProperties = {
  background: "linear-gradient(180deg, rgb(255 255 255 / 0.045), rgb(255 255 255 / 0.02))",
  border: `1px solid ${C.line}`,
};

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
