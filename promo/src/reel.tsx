import { AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { COPY, type Lang } from "./copy";
import { Brand } from "./scenes/brand";
import { Cta } from "./scenes/cta";
import { Doraemon } from "./scenes/doraemon";
import { Hook } from "./scenes/hook";
import { Ladder } from "./scenes/ladder";
import { Pitch } from "./scenes/pitch";
import { CallTheSuit } from "./scenes/suit";
import "./fonts";

const T = 12;

/** Scene lengths in frames at 30fps. */
const SCENES = { hook: 72, brand: 66, ladder: 118, suit: 104, dora: 124, pitch: 84, cta: 110 };

export const REEL_DURATION = Object.values(SCENES).reduce((a, b) => a + b, 0) - T * (Object.keys(SCENES).length - 1);

export type ReelProps = { lang: Lang };

export function Reel({ lang }: ReelProps) {
  const t = COPY[lang];
  const timing = linearTiming({ durationInFrames: T });

  return (
    <AbsoluteFill style={{ background: "#0b0a0c" }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENES.hook}>
          <Hook t={t} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.brand}>
          <Brand t={t} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-bottom" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.ladder}>
          <Ladder t={t} lang={lang} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.suit}>
          <CallTheSuit t={t} lang={lang} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={slide({ direction: "from-right" })} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.dora}>
          <Doraemon t={t} lang={lang} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.pitch}>
          <Pitch t={t} lang={lang} />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={timing} />
        <TransitionSeries.Sequence durationInFrames={SCENES.cta}>
          <Cta t={t} />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
}

/** Reel cover / Story still: the brand scene settled, plus the three game names. */
export function Cover({ lang }: ReelProps) {
  const t = COPY[lang];
  return <Brand t={t} games={[t.ladder.name, t.suit.name, t.dora.name]} />;
}
