"use client";

import { rankLabel, SUIT_SYMBOL, type Card } from "@/lib/cards";
import { buzz } from "@/lib/device";
import type { Dict } from "@/lib/i18n";
import { ladderResult, type LadderGuess } from "@/lib/rules";
import { useApp, useTurns } from "@/lib/store";
import { usePredictionDeck } from "@/lib/use-prediction-deck";
import { GameShell, OutcomeBanner, RuleList, type Outcome } from "../game-shell";
import { PlayingCard } from "../playing-card";
import { CardPair, PassStep, Question } from "./shared";

const short = (c: Card) => `${rankLabel(c.rank)}${SUIT_SYMBOL[c.suit]}`;

function toOutcome(t: Dict, base: Card, drawn: Card, guess: LadderGuess, player: string): Outcome {
  const detail = `${t.ladder[guess]} · ${short(base)} → ${short(drawn)}`;
  switch (ladderResult(base, drawn, guess)) {
    case "win":
      return { tone: "safe", text: t.ladder.win, detail };
    case "drink1":
      return { tone: "drink", text: t.ladder.lose(player), detail };
    case "everyoneElse":
      return { tone: "all", text: t.ladder.equalWin(player), detail };
    case "drink2":
      return { tone: "drink", text: t.ladder.equalLose(player), detail };
  }
}

export function LadderGame() {
  const { t, order } = useApp();
  const turns = useTurns(order);
  const game = usePredictionDeck<LadderGuess>();

  const outcome =
    game.drawn && game.choice ? toOutcome(t, game.base, game.drawn, game.choice, turns.current) : null;

  const guess = (g: LadderGuess) => {
    game.guess(g);
    buzz(15);
  };

  return (
    <GameShell
      gameName={t.games.ladder.name}
      round={turns.round}
      current={turns.current}
      next={turns.next}
      cardsLeft={game.cardsLeft}
      rules={<RuleList items={t.ladder.rules} />}
      actions={
        outcome ? (
          <PassStep
            outcome={<OutcomeBanner outcome={outcome} />}
            deckEmpty={game.deckEmpty}
            nextName={turns.next}
            onNext={() => {
              game.next();
              turns.advance();
            }}
          />
        ) : (
          <div className="animate-rise">
            <Question>{t.ladder.question}</Question>
            <div className="flex flex-col gap-2.5">
              <DirectionButton label={t.ladder.higher} icon="▲" onClick={() => guess("higher")} />
              <button
                type="button"
                onClick={() => guess("equal")}
                className="panel flex min-h-14 short:min-h-12 items-center justify-between gap-3 rounded-2xl px-5 text-left transition active:scale-[0.98] active:border-amber/60"
              >
                <span className="text-base font-semibold text-bone">{t.ladder.equal}</span>
                <span className="label-caps text-amber">{t.ladder.equalTag}</span>
              </button>
              <DirectionButton label={t.ladder.lower} icon="▼" onClick={() => guess("lower")} />
            </div>
          </div>
        )
      }
    >
      <CardPair
        left={<PlayingCard key={`b${game.round}`} card={game.base} faceUp />}
        right={<PlayingCard key={`n${game.round}`} card={game.drawn} faceUp={game.drawn !== null} />}
      />
      <p className="text-center text-xs text-mute/70">{t.ladder.scale}</p>
    </GameShell>
  );
}

function DirectionButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-17 short:min-h-13 items-center justify-between gap-3 rounded-2xl border border-amber/55 bg-linear-to-r from-[#2e2a1a] to-[#1a1913] px-5 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition hover:border-amber active:scale-[0.98] active:border-amber"
    >
      <span className="text-xl font-bold text-bone short:text-lg">{label}</span>
      <span className="text-lg text-amber" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
