import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import {
  Actions,
  DirectionButton,
  GameTop,
  Outcome,
  PanelButton,
  PlayerRow,
  PrimaryButton,
  Question,
  ScreenPad,
  Tap,
  flipAt,
  pressAt,
  rise,
} from "../components/app-ui";
import { Backdrop } from "../components/backdrop";
import { Caption } from "../components/caption";
import { Phone } from "../components/phone";
import { PlayingCard } from "../components/playing-card";
import { Sticker } from "../components/sticker";
import type { Copy, Lang } from "../copy";
import { C } from "../theme";

const TAP = 34;
const FLIP = TAP + 6;
const RESULT = FLIP + 16;

/** Ladder: guess "higher" on 9♠, a 4♥ comes up, drink. */
export function Ladder({ t, lang }: { t: Copy; lang: Lang }) {
  const frame = useCurrentFrame();
  const done = frame >= RESULT;
  const shake = interpolate(frame, [RESULT, RESULT + 4, RESULT + 18], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const flash = interpolate(frame, [RESULT, RESULT + 2, RESULT + 14], [0, 0.35, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const [me, next] = t.players;

  return (
    <AbsoluteFill>
      <Backdrop />
      <Caption index="01" headline={t.ladder.headline} sub={t.ladder.sub} lang={lang} />
      <Phone shake={shake}>
        <ScreenPad>
          <GameTop name={t.ladder.name} rules={t.rules} endGame={t.endGame} />
          <PlayerRow name={me} icon="beer-mug" next={next} nextIcon="margarita" passLabel={t.passTo(next)} active={done} />
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18 }}>
            <PlayingCard card={{ rank: 9, suit: "spades" }} width={128} />
            <PlayingCard card={{ rank: 4, suit: "hearts" }} width={128} flip={flipAt(frame, FLIP)} />
          </div>
        </ScreenPad>
        <Actions>
          {done ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Outcome tone="drink" text={t.ladder.lose} detail={t.ladder.detail} start={RESULT} />
              <div style={rise(frame, RESULT + 10)}>
                <PrimaryButton>{t.passTo(next)} →</PrimaryButton>
              </div>
            </div>
          ) : (
            <div style={rise(frame, 8)}>
              <Question>{t.ladder.question}</Question>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <DirectionButton label={t.ladder.higher} arrow="up" pressed={pressAt(frame, TAP)} />
                <PanelButton style={{ minHeight: 56 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{t.ladder.equal}</span>
                </PanelButton>
                <DirectionButton label={t.ladder.lower} arrow="down" />
              </div>
            </div>
          )}
        </Actions>
        <Tap x={195} y={500} at={TAP} />
        <AbsoluteFill style={{ background: C.hot, opacity: flash, mixBlendMode: "screen" }} />
      </Phone>
      <Sticker at={RESULT + 8} x={800} y={1500} rotate={-10} tone="hot">
        🥃 {lang === "th" ? "หมดแก้ว!" : "Bottoms up!"}
      </Sticker>
    </AbsoluteFill>
  );
}
