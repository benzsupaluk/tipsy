import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { GameTop, PlayerRow, ScreenPad, Tap, flipAt, pressAt, rise } from "../components/app-ui";
import { Backdrop } from "../components/backdrop";
import { Caption } from "../components/caption";
import { Phone } from "../components/phone";
import { PlayingCard } from "../components/playing-card";
import { Sticker } from "../components/sticker";
import type { Copy, Lang } from "../copy";
import { C, panel } from "../theme";

const TAP = 26;
const FLIP = TAP + 4;
const RULE = FLIP + 14;
const CARD_W = 168;

/** Doraemon: tap the deck, a 7♦ flips, the "Sevens" rule appears. */
export function Doraemon({ t, lang }: { t: Copy; lang: Lang }) {
  const frame = useCurrentFrame();
  const d = t.dora;
  const [me, next] = t.players;
  const flip = flipAt(frame, FLIP);
  const lift = flip * -10;

  return (
    <AbsoluteFill>
      <Backdrop />
      <Caption index="03" headline={d.headline} sub={d.sub} lang={lang} />
      <Phone>
        <ScreenPad>
          <GameTop name={d.name} rules={t.rules} endGame={t.endGame} />
          <PlayerRow name={me} icon="beer-mug" next={next} nextIcon="margarita" passLabel={t.passTo(next)} active={frame >= RULE} />
          <p
            style={{
              margin: "10px 0 0",
              borderRadius: 6,
              background: "rgb(255 107 107 / 0.06)",
              padding: "9px 14px",
              textAlign: "center",
              fontSize: 14,
              color: C.danger,
            }}
          >
            ☝️🚫 {d.noPointing}
          </p>
          <div style={{ position: "relative", display: "flex", justifyContent: "center", marginTop: 16, height: CARD_W * 1.4 }}>
            <div style={{ position: "relative", width: CARD_W, transform: `scale(${1 - 0.03 * pressAt(frame, TAP)})` }}>
              <DeckBack offset={[8, 6]} rotate={4} opacity={0.25} />
              <DeckBack offset={[4, 2]} rotate={2} opacity={0.35} />
              <PlayingCard card={{ rank: 7, suit: "diamonds" }} width={CARD_W} flip={flip} style={{ position: "relative", transform: `translateY(${lift}px)` }} />
            </div>
          </div>
          <div style={{ ...panel, marginTop: 18, minHeight: 150, borderRadius: 16, padding: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {frame >= RULE ? (
              <div style={{ textAlign: "center", ...rise(frame, RULE) }}>
                <p style={{ margin: 0, fontSize: 30, fontWeight: 700, color: C.amber }}>{d.title}</p>
                <p style={{ margin: "8px 0 0", fontSize: 16, lineHeight: 1.55, color: "rgb(244 239 230 / 0.85)" }}>{d.body}</p>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 40,
                    height: 40,
                    borderRadius: 99,
                    border: `1px dashed ${C.line}`,
                    fontSize: 18,
                    fontWeight: 700,
                    color: "rgb(142 138 148 / 0.6)",
                  }}
                >
                  ?
                </span>
                <p style={{ margin: 0, fontSize: 15, color: C.mute }}>{d.draw}</p>
              </div>
            )}
          </div>
        </ScreenPad>
        <Tap x={195} y={400} at={TAP} />
      </Phone>
      <Sticker at={RULE + 20} x={790} y={1470} rotate={-9} tone="hot">
        1, 2, 3 … 🤯
      </Sticker>
      <Counter at={RULE + 8} lang={lang} />
    </AbsoluteFill>
  );
}

function DeckBack({ offset, rotate, opacity }: { offset: [number, number]; rotate: number; opacity: number }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        aspectRatio: "5 / 7",
        borderRadius: "7%",
        border: `1px solid rgb(240 182 74 / ${opacity})`,
        background: C.plum,
        transform: `translate(${offset[0]}px, ${offset[1]}px) rotate(${rotate}deg)`,
      }}
    />
  );
}

/** Counting 1…6, then a buzzer on 7. */
function Counter({ at, lang }: { at: number; lang: Lang }) {
  const frame = useCurrentFrame() - at;
  if (frame < 0) return null;
  const n = Math.min(Math.floor(frame / 5) + 1, 7);
  const pop = interpolate(frame % 5, [0, 4], [1.25, 1]);
  const bust = n === 7;
  return (
    <div
      style={{
        position: "absolute",
        left: 110,
        top: 1320,
        width: 150,
        height: 150,
        borderRadius: 99,
        display: "grid",
        placeItems: "center",
        background: bust ? C.hot : C.raised,
        border: `4px solid ${bust ? "#fff" : C.amber}`,
        color: bust ? "#fff" : C.amber,
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: bust ? 54 : 80,
        fontWeight: 700,
        transform: `scale(${bust ? 1.1 : pop}) rotate(${bust ? Math.sin(frame) * 8 : 0}deg)`,
        boxShadow: "0 20px 50px -10px rgb(0 0 0 / 0.7)",
        zIndex: 40,
      }}
    >
      {bust ? (lang === "th" ? "ดื่ม!" : "SIP!") : n}
    </div>
  );
}
