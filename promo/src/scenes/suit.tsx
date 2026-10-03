import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Actions, GameTop, Outcome, PanelButton, PlayerRow, PrimaryButton, Question, ScreenPad, Tap, flipAt, pressAt, rise } from "../components/app-ui";
import { Backdrop } from "../components/backdrop";
import { Caption } from "../components/caption";
import { Phone } from "../components/phone";
import { PlayingCard, SUIT_SYMBOL, type Suit } from "../components/playing-card";
import { Sticker } from "../components/sticker";
import type { Copy, Lang } from "../copy";
import { C } from "../theme";

const SUITS: Suit[] = ["clubs", "diamonds", "hearts", "spades"];
const TAP = 30;
const FLIP = TAP + 6;
const RESULT = FLIP + 16;

/** Call the Suit: pick hearts, Q♥ comes up, safe. */
export function CallTheSuit({ t, lang }: { t: Copy; lang: Lang }) {
  const frame = useCurrentFrame();
  const done = frame >= RESULT;
  // Second player's turn now.
  const [next, me] = t.players;

  return (
    <AbsoluteFill>
      <Backdrop />
      <Caption index="02" headline={t.suit.headline} sub={t.suit.sub} lang={lang} />
      <Phone>
        <ScreenPad>
          <GameTop name={t.suit.name} rules={t.rules} endGame={t.endGame} />
          <PlayerRow name={me} icon="margarita" next={next} nextIcon="beer-mug" passLabel={t.passTo(next)} active={done} />
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 18 }}>
            <PlayingCard card={{ rank: 6, suit: "clubs" }} width={128} />
            <PlayingCard card={{ rank: 12, suit: "hearts" }} width={128} flip={flipAt(frame, FLIP)} />
          </div>
        </ScreenPad>
        <Actions>
          {done ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <Outcome tone="safe" text={t.suit.correct} detail={t.suit.detail} start={RESULT} />
              <div style={rise(frame, RESULT + 8)}>
                <PrimaryButton>{t.passTo(next)} →</PrimaryButton>
              </div>
            </div>
          ) : (
            <div style={rise(frame, 8)}>
              <Question>{t.suit.question}</Question>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {SUITS.map((s) => (
                  <PanelButton key={s} pressed={s === "hearts" ? pressAt(frame, TAP) : 0} style={{ minHeight: 76, flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 30, lineHeight: 1, color: s === "hearts" || s === "diamonds" ? C.suitRed : C.bone }}>{SUIT_SYMBOL[s]}</span>
                    <span style={{ fontSize: 14, fontWeight: 600 }}>{t.suit.suits[s]}</span>
                  </PanelButton>
                ))}
              </div>
            </div>
          )}
        </Actions>
        <Tap x={105} y={632} at={TAP} />
      </Phone>
      <Sticker at={RESULT + 6} x={290} y={1490} rotate={8} tone="safe">
        😎 {lang === "th" ? "รอดดด" : "Lucky!"}
      </Sticker>
    </AbsoluteFill>
  );
}
