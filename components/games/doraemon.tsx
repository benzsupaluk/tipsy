"use client";

import { useReducer } from "react";
import { newDeck, rankLabel, type Card } from "@/lib/cards";
import type { Dict } from "@/lib/i18n";
import { buzz } from "@/lib/device";
import { useApp, useTurns } from "@/lib/store";
import { GameShell } from "../game-shell";
import { PlayingCard } from "../playing-card";
import { Button, Label, PillButton } from "../ui";

type State = {
  deck: Card[];
  drawn: Card | null;
  draws: number;
  /** Kings drawn so far, including the one on the table. */
  kings: number;
  /** Player index nobody may talk to (latest Q). */
  queen: number | null;
  buddies: [number, number][];
  buddyPicked: boolean;
  /** Bathroom passes held, by player index. */
  passes: Record<number, number>;
};

type Action =
  | { type: "draw"; player: number }
  | { type: "pass"; freshDeck: Card[] | null }
  | { type: "buddy"; a: number; b: number }
  | { type: "usePass"; player: number };

function init(deck: Card[]): State {
  return { deck, drawn: null, draws: 0, kings: 0, queen: null, buddies: [], buddyPicked: false, passes: {} };
}

function reducer(s: State, a: Action): State {
  switch (a.type) {
    case "draw": {
      if (s.drawn || s.deck.length === 0) return s;
      const [card, ...deck] = s.deck;
      return {
        ...s,
        deck,
        drawn: card,
        draws: s.draws + 1,
        buddyPicked: false,
        kings: card.rank === 13 ? s.kings + 1 : s.kings,
        queen: card.rank === 12 ? a.player : s.queen,
        passes: card.rank === 8 ? { ...s.passes, [a.player]: (s.passes[a.player] ?? 0) + 1 } : s.passes,
      };
    }
    case "pass":
      return a.freshDeck ? init(a.freshDeck) : { ...s, drawn: null };
    case "buddy":
      if (s.buddyPicked) return s;
      return { ...s, buddies: [...s.buddies, [a.a, a.b]], buddyPicked: true };
    case "usePass": {
      const held = s.passes[a.player] ?? 0;
      if (held <= 0) return s;
      return { ...s, passes: { ...s.passes, [a.player]: held - 1 } };
    }
  }
}

type Rule = { title: string; body: string; big?: string };

function ruleFor(t: Dict, card: Card, kings: number, who: { current: string; left: string; right: string }): Rule {
  const d = t.dora;
  switch (card.rank) {
    case 1:
    case 2:
    case 3:
    case 4:
      return { title: d.sipsTitle(card.rank), body: d.sipsBody(who.current, card.rank), big: d.sip(card.rank) };
    case 5:
      return d.r5;
    case 6:
      return { title: d.r6.title, body: d.r6.body(who.current) };
    case 7:
      return d.r7;
    case 8:
      return { title: d.r8.title, body: d.r8.body(who.current) };
    case 9:
      return { title: d.r9.title, body: d.r9.body(who.left) };
    case 10:
      return { title: d.r10.title, body: d.r10.body(who.right) };
    case 11:
      return { title: d.rJ.title, body: d.rJ.body(who.current) };
    case 12:
      return { title: d.rQ.title, body: d.rQ.body(who.current) };
    default: {
      const k = Math.min(Math.max(kings, 1), 4);
      return {
        title: `${d.kTitle(k)} · ${d.kParts[k - 1]}`,
        body: k < 4 ? d.kBody(who.current) : d.kLast(who.current),
      };
    }
  }
}

export function DoraemonGame() {
  const { t, order } = useApp();
  const turns = useTurns(order);
  const [s, dispatch] = useReducer(reducer, undefined, () => init(newDeck()));
  const d = t.dora;

  const rule = s.drawn
    ? ruleFor(t, s.drawn, s.kings, { current: turns.current, left: turns.next, right: turns.prev })
    : null;
  const deckDone = s.drawn !== null && s.deck.length === 0;

  const draw = () => {
    dispatch({ type: "draw", player: turns.index });
    buzz(15);
  };

  return (
    <GameShell
      gameName={t.games.doraemon.name}
      round={turns.round}
      current={turns.current}
      next={turns.next}
      cardsLeft={s.deck.length}
      rules={<DoraemonRules t={t} />}
      actions={
        s.drawn ? (
          <div className="flex flex-col gap-2">
            {deckDone ? <p className="text-center text-sm text-amber/90">{t.deckDone}</p> : null}
            <Button
              onClick={() => {
                dispatch({ type: "pass", freshDeck: deckDone ? newDeck() : null });
                turns.advance();
              }}
            >
              {deckDone ? t.newDeck : `${t.passTo(turns.next)} →`}
            </Button>
          </div>
        ) : (
          <Button onClick={draw}>{d.draw}</Button>
        )
      }
    >
      <p className="flex items-center justify-center gap-2 rounded-full border border-danger/30 bg-danger/6 px-4 py-2.5 text-center text-sm text-danger">
        <span className="whitespace-nowrap" aria-hidden="true">
          🚫☝️
        </span>
        {d.noPointing}
      </p>

      <div className="flex justify-center">
        {s.drawn ? (
          <PlayingCard key={s.draws} card={s.drawn} faceUp flipIn />
        ) : (
          <button
            type="button"
            onClick={draw}
            aria-label={d.draw}
            className="group relative rounded-[7%] transition active:scale-[0.97]"
          >
            <span className="absolute inset-0 translate-x-2 translate-y-1.5 rotate-4 rounded-[7%] border border-amber/25 bg-plum" aria-hidden="true" />
            <span className="absolute inset-0 translate-x-1 translate-y-0.5 rotate-2 rounded-[7%] border border-amber/35 bg-plum" aria-hidden="true" />
            <PlayingCard card={null} faceUp={false} className="relative transition duration-300 group-hover:-translate-y-1" />
          </button>
        )}
      </div>

      {s.drawn && rule ? (
        <section key={s.draws} className="panel flex animate-rise flex-col gap-3 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-amber/50 text-lg font-bold text-amber">
              {rankLabel(s.drawn.rank)}
            </span>
            <h2 className="text-2xl font-bold leading-tight text-bone">{rule.title}</h2>
          </div>
          {rule.big ? <p className="text-3xl font-bold text-danger">🥃 {rule.big}</p> : null}
          <p className="text-[15px] leading-relaxed text-bone/85">{rule.body}</p>

          {s.drawn.rank === 5 ? (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-amber">{d.pickBuddy(turns.current)}</p>
              <div className="flex flex-wrap gap-2">
                {order.map((name, i) =>
                  i === turns.index ? null : (
                    <PillButton
                      key={`${name}-${i}`}
                      disabled={s.buddyPicked}
                      onClick={() => dispatch({ type: "buddy", a: turns.index, b: i })}
                    >
                      {name}
                    </PillButton>
                  ),
                )}
              </div>
            </div>
          ) : null}

          {s.drawn.rank === 9 || s.drawn.rank === 10 ? <p className="text-xs text-mute">{d.seatHint}</p> : null}
        </section>
      ) : (
        <p className="text-center text-sm text-mute">{d.tapToDraw}</p>
      )}

      <TableStatus
        t={t}
        order={order}
        kings={s.kings}
        queen={s.queen}
        buddies={s.buddies}
        passes={s.passes}
        onUsePass={(player) => dispatch({ type: "usePass", player })}
      />
    </GameShell>
  );
}

function TableStatus({
  t,
  order,
  kings,
  queen,
  buddies,
  passes,
  onUsePass,
}: {
  t: Dict;
  order: string[];
  kings: number;
  queen: number | null;
  buddies: [number, number][];
  passes: Record<number, number>;
  onUsePass: (player: number) => void;
}) {
  const d = t.dora;
  const holders = Object.entries(passes).filter(([, n]) => n > 0);

  return (
    <section className="panel flex flex-col gap-4 rounded-2xl p-5">
      <Label>{d.table}</Label>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-mute">{d.kMeter}</p>
          <div className="mt-2 flex items-center gap-1.5" aria-label={`${kings}/4`}>
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={`grid size-7 place-items-center rounded-md border text-sm font-bold transition ${
                  i <= kings ? "border-amber/70 bg-amber/15 text-amber" : "border-line text-white/20"
                }`}
              >
                {i === 4 && kings >= 4 ? "💀" : "K"}
              </span>
            ))}
          </div>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-mute">{d.queen}</p>
          <p className="mt-2 truncate text-[15px] font-semibold text-bone">
            {queen !== null ? `🤫 ${order[queen]}` : <span className="font-normal text-mute/70">{d.noQueen}</span>}
          </p>
        </div>
      </div>

      <div>
        <p className="text-xs text-mute">{d.buddies}</p>
        {buddies.length ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {buddies.map(([a, b], i) => (
              <li key={i} className="rounded-full bg-white/6 px-3 py-1.5 text-sm text-bone">
                {order[a]} <span className="text-amber">&amp;</span> {order[b]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-mute/70">{d.noBuddies}</p>
        )}
      </div>

      <div>
        <p className="text-xs text-mute">{d.passes}</p>
        {holders.length ? (
          <ul className="mt-2 flex flex-col gap-2">
            {holders.map(([idx, n]) => (
              <li key={idx} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 py-1 pl-3 pr-1">
                <span className="text-sm text-bone">
                  🚻 {order[Number(idx)]} <span className="font-bold text-amber">×{n}</span>
                </span>
                <PillButton onClick={() => onUsePass(Number(idx))}>{d.use}</PillButton>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-sm text-mute/70">{d.noPasses}</p>
        )}
      </div>
    </section>
  );
}

function DoraemonRules({ t }: { t: Dict }) {
  return (
    <div className="flex flex-col gap-4">
      <table className="w-full border-separate border-spacing-y-2 text-left">
        <tbody>
          {t.dora.rulesTable.map((r) => (
            <tr key={r.card}>
              <th scope="row" className="w-20 align-top font-bold text-amber">
                {r.card}
              </th>
              <td className="align-top">{r.rule}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="text-sm text-mute">{t.dora.seatHint}</p>
    </div>
  );
}
