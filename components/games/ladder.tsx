"use client";

import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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

function toOutcome(t: Dict, base: Card, drawn: Card, guess: LadderGuess): Outcome {
  const detail = `${t.ladder[guess]} · ${short(base)} → ${short(drawn)}`;
  switch (ladderResult(base, drawn, guess)) {
    case "win":
      return { tone: "safe", text: t.ladder.win, detail };
    case "drink1":
      return { tone: "drink", text: t.ladder.lose, detail };
    case "everyoneElse":
      return { tone: "all", text: t.ladder.equalWin, detail };
    case "drink2":
      return { tone: "drink", text: t.ladder.equalLose, detail };
  }
}

export function LadderGame() {
  const { t, order, orderIcons } = useApp();
  const turns = useTurns(order, orderIcons);
  const game = usePredictionDeck<LadderGuess>();

  const outcome = game.drawn && game.choice ? toOutcome(t, game.base, game.drawn, game.choice) : null;

  const passNext = () => {
    game.next();
    turns.advance();
  };

  const guess = (g: LadderGuess) => {
    game.guess(g);
    buzz(15);
  };

  return (
    <GameShell
      gameId="ladder"
      gameName={t.games.ladder.name}
      round={turns.round}
      current={turns.current}
      currentIcon={turns.currentIcon}
      next={turns.next}
      nextIcon={turns.nextIcon}
      rules={<RuleList items={t.ladder.rules} />}
      onPassNext={outcome ? passNext : undefined}
      actions={
        outcome ? (
          <PassStep
            outcome={<OutcomeBanner outcome={outcome} player={turns.current} icon={turns.currentIcon} />}
            deckEmpty={game.deckEmpty}
            nextName={turns.next}
            onNext={passNext}
          />
        ) : (
          <div className="animate-rise">
            <Question>{t.ladder.question}</Question>
            <div className="flex flex-col gap-2.5">
              <DirectionButton
                label={t.ladder.higher}
                icon={<ChevronUpIcon className="size-6" strokeWidth={2.5} />}
                onClick={() => guess("higher")}
              />
              <button
                type="button"
                onClick={() => guess("equal")}
                className="flex min-h-14 items-center justify-center gap-3 rounded-2xl px-5 text-left transition panel active:scale-[0.98] active:border-amber/60 short:min-h-12"
              >
                <span className="text-base font-semibold text-bone">{t.ladder.equal}</span>
              </button>
              <DirectionButton
                label={t.ladder.lower}
                icon={<ChevronDownIcon className="size-6" strokeWidth={2.5} />}
                onClick={() => guess("lower")}
              />
            </div>
          </div>
        )
      }
    >
      <CardPair
        left={<PlayingCard key={`b${game.round}`} card={game.base} faceUp />}
        right={<PlayingCard key={`n${game.round}`} card={game.drawn} faceUp={game.drawn !== null} />}
      />
      <div className="text-center">
        <p className="text-xs text-mute/70">{t.ladder.scale}</p>
        <p className="mt-1 text-sm text-mute tabular-nums">{t.cardsLeft(game.cardsLeft)}</p>
      </div>
    </GameShell>
  );
}

function DirectionButton({ label, icon, onClick }: { label: string; icon: React.ReactNode; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative flex min-h-17 items-center justify-center gap-3 rounded-2xl border border-amber/55 bg-linear-to-r from-[#2e2a1a] to-[#1a1913] px-5 text-left shadow-[inset_0_1px_0_rgb(255_255_255/0.04)] transition hover:border-amber active:scale-[0.98] active:border-amber short:min-h-13"
    >
      <span className="text-center text-xl font-bold text-bone short:text-lg">{label}</span>
      <span className="absolute right-4 text-amber" aria-hidden="true">
        {icon}
      </span>
    </button>
  );
}
