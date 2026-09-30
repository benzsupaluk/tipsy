"use client";

import { ArrowLeftIcon, ArrowRightIcon, ChevronDownIcon } from "lucide-react";
import { useReducer, useState } from "react";
import { newDeck, rankLabel, type Card } from "@/lib/cards";
import type { Dict } from "@/lib/i18n";
import { buzz } from "@/lib/device";
import { useApp, useTurns } from "@/lib/store";
import { GameShell } from "../game-shell";
import { PlayerIcon } from "../player-icon";
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

type Rule = {
  title: string;
  body?: string;
  big?: string;
  dir?: "left" | "right";
  /** Large line shown above the body (e.g. the King's command). */
  headline?: string;
  /** Append the drawer (icon + name) after the body. */
  drawer?: boolean;
};

function ruleFor(t: Dict, card: Card, kings: number): Rule {
  const d = t.dora;
  switch (card.rank) {
    case 1:
    case 2:
    case 3:
    case 4:
      return { title: d.sipsTitle(card.rank), big: d.sip(card.rank) };
    case 5:
      return d.r5;
    case 6:
      return { title: d.r6.title, body: d.r6.body };
    case 7:
      return d.r7;
    case 8:
      return { title: d.r8.title, body: d.r8.body };
    case 9:
      return { title: d.r9.title, body: d.r9.body, dir: "left" };
    case 10:
      return { title: d.r10.title, body: d.r10.body, dir: "right" };
    case 11:
      return { title: d.rJ.title, body: d.rJ.body };
    case 12:
      return { title: d.rQ.title, body: d.rQ.body, drawer: true };
    default: {
      const k = Math.min(Math.max(kings, 1), 4);
      return {
        title: d.kTitle(k),
        headline: d.kCommands[k - 1],
        body: k < 4 ? undefined : d.kLast,
      };
    }
  }
}

export function DoraemonGame() {
  const { t, order, orderIcons } = useApp();
  const turns = useTurns(order, orderIcons);
  const [s, dispatch] = useReducer(reducer, undefined, () => init(newDeck()));
  const d = t.dora;

  const rule = s.drawn ? ruleFor(t, s.drawn, s.kings) : null;
  /** A–4: straight drinking cards get the bomb treatment. */
  const bomb = Boolean(rule?.big);
  const deckDone = s.drawn !== null && s.deck.length === 0;

  const draw = () => {
    dispatch({ type: "draw", player: turns.index });
    buzz(15);
  };

  const passNext = () => {
    dispatch({ type: "pass", freshDeck: deckDone ? newDeck() : null });
    turns.advance();
  };

  return (
    <GameShell
      gameId="doraemon"
      gameName={t.games.doraemon.name}
      round={turns.round}
      current={turns.current}
      currentIcon={turns.currentIcon}
      next={turns.next}
      nextIcon={turns.nextIcon}
      rules={<DoraemonRules t={t} />}
      onPassNext={s.drawn ? passNext : undefined}
      actions={
        s.drawn ? (
          <div className="flex flex-col gap-2">
            {deckDone ? <p className="text-center text-sm text-amber/90">{t.deckDone}</p> : null}
            <Button onClick={passNext}>
              {deckDone ? (
                t.newDeck
              ) : (
                <>
                  {t.passTo(turns.next)}
                  <ArrowRightIcon className="size-5" aria-hidden="true" />
                </>
              )}
            </Button>
          </div>
        ) : (
          <Button onClick={draw}>{d.draw}</Button>
        )
      }
    >
      <p className="flex items-center justify-center gap-2 rounded bg-danger/6 px-4 py-2.5 text-center text-sm text-danger">
        <span className="whitespace-nowrap" aria-hidden="true">
          🚫☝️
        </span>
        {d.noPointing}
      </p>

      <div className="[container-type:size] flex min-h-52 flex-1 items-center justify-center">
        {s.drawn ? (
          <button
            type="button"
            onClick={passNext}
            aria-label={deckDone ? t.newDeck : t.passTo(turns.next)}
            className="rounded-[7%] transition active:scale-[0.97]"
          >
            <PlayingCard key={s.draws} card={s.drawn} faceUp flipIn size="fill" />
          </button>
        ) : (
          <button type="button" onClick={draw} aria-label={d.draw} className="group relative rounded-[7%] transition active:scale-[0.97]">
            <span
              className="absolute inset-0 translate-x-2 translate-y-1.5 rotate-4 rounded-[7%] border border-amber/25 bg-plum"
              aria-hidden="true"
            />
            <span
              className="absolute inset-0 translate-x-1 translate-y-0.5 rotate-2 rounded-[7%] border border-amber/35 bg-plum"
              aria-hidden="true"
            />
            <PlayingCard card={null} faceUp={false} size="fill" className="relative transition duration-300 group-hover:-translate-y-1" />
          </button>
        )}
      </div>
      <p className="-mt-2 text-center text-sm text-mute tabular-nums">{t.cardsLeft(s.deck.length)}</p>

      {/* Tapping the panel mirrors the main action button: draw, or pass once a card is up. */}
      <section
        // Remount per draw so the blast replays on every drink card.
        key={s.draws}
        onClick={s.drawn ? passNext : draw}
        className={`flex min-h-30 cursor-pointer rounded-2xl p-5 transition select-none active:scale-[0.99] ${
          bomb
            ? "border-2 border-[#ff3b30] bg-radial-[at_50%_30%] from-[#ff3b30]/40 via-[#b3121b]/25 to-[#3a0a0e]/60 motion-safe:[animation:boom_0.35s_cubic-bezier(0.36,0.07,0.19,0.97)_both,fuse_0.8s_ease-in-out_0.35s_2]"
            : "panel"
        }`}
      >
        {s.drawn && rule ? (
          <div key={s.draws} className="flex h-auto w-full animate-rise flex-col items-center justify-center gap-3 text-center">
            {rule.big ? (
              <>
                <p className="text-lg font-bold text-danger">{"🍺".repeat(s.drawn.rank)}</p>
                <p className="text-2xl font-bold text-danger">{rule.big}</p>
              </>
            ) : null}
            {rule.dir ? (
              <p className="flex items-center gap-2 text-3xl font-bold text-danger">
                {rule.dir === "left" ? <ArrowLeftIcon className="size-8" aria-hidden="true" /> : null}
                {rule.title}
                {rule.dir === "right" ? <ArrowRightIcon className="size-8" aria-hidden="true" /> : null}
              </p>
            ) : null}
            {rule.headline ? <p className="text-3xl font-bold text-amber">{rule.headline}</p> : null}
            {rule.body && (
              <p className="text-lg leading-relaxed text-bone/85">
                {rule.body}
                {rule.drawer ? (
                  <>
                    {" "}
                    <PlayerIcon id={turns.currentIcon} size={22} className="-mt-0.5 mr-1 inline-block align-middle" />
                    <span className="font-semibold text-bone">{turns.current}</span>
                  </>
                ) : null}
              </p>
            )}

            {s.drawn.rank === 5 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm font-semibold text-amber">{d.pickBuddy}</p>
                <div className="flex flex-wrap gap-2">
                  {order.map((name, i) =>
                    i === turns.index ? null : (
                      <PillButton
                        key={`${name}-${i}`}
                        disabled={s.buddyPicked}
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch({ type: "buddy", a: turns.index, b: i });
                          passNext();
                        }}
                      >
                        <PlayerIcon id={orderIcons[i]} size={18} className="-mt-0.5 mr-1 inline-block align-middle" />
                        {name}
                      </PillButton>
                    ),
                  )}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-dashed border-line text-lg font-bold text-mute/60">
              ?
            </span>
            <p className="text-[15px] text-mute">{d.tapToDraw}</p>
          </div>
        )}
      </section>

      <TableStatus
        t={t}
        order={order}
        icons={orderIcons}
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
  icons,
  kings,
  queen,
  buddies,
  passes,
  onUsePass,
}: {
  t: Dict;
  order: string[];
  icons: string[];
  kings: number;
  queen: number | null;
  buddies: [number, number][];
  passes: Record<number, number>;
  onUsePass: (player: number) => void;
}) {
  const d = t.dora;
  const holders = Object.entries(passes).filter(([, n]) => n > 0);
  const [open, setOpen] = useState(true);

  return (
    <section className="flex flex-col gap-4 rounded-2xl p-5 panel">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="dora-table"
        className="-m-1 flex items-center justify-between gap-3 rounded-lg p-1 text-left"
      >
        <Label>{d.table}</Label>
        <ChevronDownIcon aria-hidden className={`size-4 text-mute transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div id="dora-table" className="flex flex-col gap-4">
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
                {queen !== null ? (
                  <>
                    🤫 <PlayerIcon id={icons[queen]} size={18} className="-mt-0.5 mr-1 inline-block align-middle" />
                    {order[queen]}
                  </>
                ) : (
                  <span className="font-normal text-mute/70">{d.noQueen}</span>
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-mute">{d.buddies}</p>
            {buddies.length ? (
              <ul className="mt-2 flex flex-wrap gap-2">
                {buddies.map(([a, b], i) => (
                  <li key={i} className="rounded-full bg-white/6 px-3 py-1.5 text-sm text-bone">
                    <PlayerIcon id={icons[a]} size={18} className="-mt-0.5 mr-1 inline-block align-middle" />
                    {order[a]} <span className="text-amber">&amp;</span>{" "}
                    <PlayerIcon id={icons[b]} size={18} className="-mt-0.5 mr-1 inline-block align-middle" />
                    {order[b]}
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
                  <li key={idx} className="flex items-center justify-between gap-3 rounded-xl bg-white/5 py-1 pr-1 pl-3">
                    <span className="text-sm text-bone">
                      🚻 <PlayerIcon id={icons[Number(idx)]} size={18} className="-mt-0.5 mr-1 inline-block align-middle" />
                      {order[Number(idx)]} <span className="font-bold text-amber">×{n}</span>
                    </span>
                    <PillButton onClick={() => onUsePass(Number(idx))}>{d.use}</PillButton>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-mute/70">{d.noPasses}</p>
            )}
          </div>
        </div>
      )}
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
    </div>
  );
}
