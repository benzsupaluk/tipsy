"use client";

import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { nextCharacter } from "@/lib/characters";
import { PLAY_HREF, type GameId } from "@/lib/games";
import { useApp } from "@/lib/store";
import { DonateDrawer } from "./donate-drawer";
import { PlayerIcon } from "./player-icon";
import { BackLink, LangToggle, Screen } from "./screen";
import { Badge, Button } from "./ui";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 20;

export function SetupForm({ game }: { game: GameId }) {
  const {
    t,
    hydrated,
    names,
    icons,
    randomize,
    setName,
    setIcon,
    addPlayer: add,
    removePlayer: remove,
    setRandomize,
    startSession,
  } = useApp();
  const router = useRouter();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const count = names.length;

  const addPlayer = () => {
    if (count >= MAX_PLAYERS) return;
    add();
    setFocusIndex(count);
  };

  const removePlayer = (i: number) => {
    if (count <= MIN_PLAYERS) return;
    remove(i);
    setFocusIndex(null);
  };

  const start = () => {
    startSession();
    router.push(PLAY_HREF[game]);
  };

  return (
    <Screen
      top={
        <>
          <BackLink href="/" />
          <LangToggle />
        </>
      }
      actions={
        hydrated ? (
          <div className="flex flex-col items-center gap-1">
            <Button onClick={start}>{randomize ? t.startShuffled : t.start}</Button>
            <DonateDrawer className="text-xs" />
          </div>
        ) : null
      }
    >
      {hydrated ? (
        <form
          className="mt-4 flex animate-rise flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <div className="mb-1 flex items-end justify-between gap-3">
            <div>
              <Badge>{t.games[game].name}</Badge>
              <h1 className="mt-3 font-display text-4xl leading-tight font-bold text-bone">{t.whoPlaying}</h1>
            </div>
            <span className="shrink-0 rounded-full bg-white/6 px-3 py-1 text-sm font-semibold text-amber tabular-nums">
              {t.playersCount(count)}
            </span>
          </div>

          <ol className="flex flex-col gap-2.5">
            {names.map((name, i) => {
              const label = name.trim() || t.playerN(i + 1);
              return (
                <li key={i} className="flex h-15 items-center gap-2 rounded-2xl pr-1.5 pl-1.5 panel focus-within:border-amber/50">
                  <button
                    type="button"
                    aria-label={t.changeIcon(label)}
                    onClick={() => setIcon(i, nextCharacter(icons[i], icons))}
                    className="grid size-12 shrink-0 place-items-center rounded-xl transition hover:bg-white/6 active:scale-90"
                  >
                    <PlayerIcon key={icons[i]} id={icons[i]} size={40} className="animate-pop" />
                  </button>
                  <input
                    ref={(el) => {
                      inputs.current[i] = el;
                    }}
                    value={name}
                    autoFocus={i === focusIndex}
                    maxLength={20}
                    autoComplete="off"
                    autoCapitalize="words"
                    enterKeyHint={i === count - 1 ? "done" : "next"}
                    aria-label={t.playerN(i + 1)}
                    placeholder={t.playerN(i + 1)}
                    onChange={(e) => setName(i, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      if (i < count - 1) inputs.current[i + 1]?.focus();
                      else e.currentTarget.blur();
                    }}
                    className="h-full min-w-0 flex-1 bg-transparent text-[17px] text-bone placeholder:text-mute/50 focus:outline-none"
                  />
                  <button
                    type="button"
                    aria-label={t.removePlayer(label)}
                    disabled={count <= MIN_PLAYERS}
                    onClick={() => removePlayer(i)}
                    className="grid size-11 shrink-0 place-items-center rounded-full text-mute transition hover:bg-white/6 hover:text-bone active:scale-90 disabled:opacity-20"
                  >
                    <XIcon className="size-5" aria-hidden />
                  </button>
                </li>
              );
            })}
          </ol>

          <button
            type="button"
            onClick={addPlayer}
            disabled={count >= MAX_PLAYERS}
            className="flex h-15 items-center justify-center gap-2 rounded-2xl border border-dashed border-amber/50 text-[15px] font-semibold text-amber transition hover:bg-amber/5 active:scale-[0.98] disabled:opacity-30"
          >
            <span className="text-lg leading-none" aria-hidden="true">
              +
            </span>
            {t.addPlayer}
          </button>

          <label className="mt-1 flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-4 panel">
            <span className="block text-[15px] font-semibold text-bone">{t.randomize}</span>
            <input type="checkbox" checked={randomize} onChange={(e) => setRandomize(e.target.checked)} className="peer sr-only" />
            <span
              aria-hidden="true"
              className="relative h-8 w-14 shrink-0 rounded-full border border-line bg-white/8 transition peer-checked:border-amber peer-checked:bg-amber peer-focus-visible:ring-2 peer-focus-visible:ring-amber after:absolute after:top-1 after:left-1 after:size-5.5 after:rounded-full after:bg-bone after:shadow after:transition peer-checked:after:translate-x-6 peer-checked:after:bg-ink"
            />
          </label>
        </form>
      ) : null}
    </Screen>
  );
}
