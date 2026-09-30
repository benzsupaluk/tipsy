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
  const { t, order, orderIcons } = useApp();
  const turns = useTurns(order, orderIcons);
  const game = usePredictionDeck<Suit>();
  const { drawn, choice } = game;

  const revealed = drawn ? `${t.suits[drawn.suit]} ${SUIT_SYMBOL[drawn.suit]}` : "";

  const passNext = () => {
    game.next();
    turns.advance();
  };

  return (
    <GameShell
      gameId="suit"
      gameName={t.games.suit.name}
      round={turns.round}
      current={turns.current}
      currentIcon={turns.currentIcon}
      next={turns.next}
      nextIcon={turns.nextIcon}
      rules={<RuleList items={t.suit.rules} />}
      onPassNext={drawn && choice ? passNext : undefined}
      actions={
        drawn && choice ? (
          <PassStep
            outcome={
              <OutcomeBanner
                player={turns.current}
                icon={turns.currentIcon}
                outcome={
                  suitResult(drawn, choice) === "win"
                    ? { tone: "safe", text: t.suit.correct, detail: t.suit.itWas(revealed) }
                    : { tone: "drink", text: t.suit.wrong, detail: `${SUIT_SYMBOL[choice]} → ${t.suit.itWas(revealed)}` }
                }
              />
            }
            deckEmpty={game.deckEmpty}
            nextName={turns.next}
            onNext={passNext}
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
                  className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-2xl transition panel hover:border-amber/50 active:scale-[0.97] active:border-amber short:min-h-16"
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
