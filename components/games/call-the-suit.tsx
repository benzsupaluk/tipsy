"use client";

import { isRed, SUIT_SYMBOL, SUITS, type Suit } from "@/lib/cards";
import { buzz } from "@/lib/device";
import { suitResult } from "@/lib/rules";
import { useApp, useTurns } from "@/lib/store";
import { usePredictionDeck } from "@/lib/use-prediction-deck";
import { GameShell, OutcomeBanner, RuleList } from "../game-shell";
import { PlayingCard } from "../playing-card";
import { CardPair, PassStep, Question } from "./shared";

export function CallTheSuitGame() {
  const { t, order } = useApp();
  const turns = useTurns(order);
  const game = usePredictionDeck<Suit>();
  const { drawn, choice } = game;

  const revealed = drawn ? `${t.suits[drawn.suit]} ${SUIT_SYMBOL[drawn.suit]}` : "";

  return (
    <GameShell
      gameName={t.games.suit.name}
      round={turns.round}
      current={turns.current}
      next={turns.next}
      cardsLeft={game.cardsLeft}
      rules={<RuleList items={t.suit.rules} />}
      actions={
        drawn && choice ? (
          <PassStep
            outcome={
              <OutcomeBanner
                outcome={
                  suitResult(drawn, choice) === "win"
                    ? { tone: "safe", text: t.suit.correct, detail: t.suit.itWas(revealed) }
                    : { tone: "drink", text: t.suit.wrong(turns.current), detail: `${SUIT_SYMBOL[choice]} → ${t.suit.itWas(revealed)}` }
                }
              />
            }
            deckEmpty={game.deckEmpty}
            nextName={turns.next}
            onNext={() => {
              game.next();
              turns.advance();
            }}
          />
        ) : (
          <div className="animate-rise">
            <Question>{t.suit.question}</Question>
            <div className="grid grid-cols-2 gap-2.5">
              {SUITS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    game.guess(s);
                    buzz(15);
                  }}
                  className="panel flex min-h-20 short:min-h-16 flex-col items-center justify-center gap-1 rounded-2xl transition hover:border-amber/50 active:scale-[0.97] active:border-amber"
                >
                  <span className={`text-3xl leading-none ${isRed(s) ? "text-suit-red" : "text-bone"}`} aria-hidden="true">
                    {SUIT_SYMBOL[s]}
                  </span>
                  <span className="text-sm font-semibold text-bone">{t.suits[s]}</span>
                </button>
              ))}
            </div>
          </div>
        )
      }
    >
      <CardPair
        left={<PlayingCard key={`b${game.round}`} card={game.base} faceUp />}
        right={<PlayingCard key={`n${game.round}`} card={drawn} faceUp={drawn !== null} />}
      />
    </GameShell>
  );
}
