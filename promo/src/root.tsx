import { Composition } from "remotion";
import { Cover, REEL_DURATION, Reel, type ReelProps } from "./reel";
import { FPS, HEIGHT, WIDTH } from "./theme";

/** Cover animates in like the brand scene; render its last frame as the still. */
export const COVER_FRAME = 60;

export function Root() {
  return (
    <>
      <Composition id="TipsyReel" component={Reel} durationInFrames={REEL_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ lang: "th" } satisfies ReelProps} />
      <Composition id="TipsyReelEN" component={Reel} durationInFrames={REEL_DURATION} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ lang: "en" } satisfies ReelProps} />
      <Composition id="TipsyCover" component={Cover} durationInFrames={COVER_FRAME + 1} fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{ lang: "th" } satisfies ReelProps} />
    </>
  );
}
