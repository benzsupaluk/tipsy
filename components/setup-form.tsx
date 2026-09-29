"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useApp } from "@/lib/store";
import { BrandTag, LangToggle, Screen } from "./screen";
import { Button, Label } from "./ui";

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 20;

export function SetupForm() {
  const { t, hydrated, names, randomize, setNames, setRandomize, startSession } = useApp();
  const router = useRouter();
  const inputs = useRef<(HTMLInputElement | null)[]>([]);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);
  const count = names.length;

  const addPlayer = () => {
    if (count >= MAX_PLAYERS) return;
    setNames([...names, ""]);
    setFocusIndex(count);
  };

  const removePlayer = (i: number) => {
    if (count <= MIN_PLAYERS) return;
    setNames(names.filter((_, j) => j !== i));
    setFocusIndex(null);
  };

  const start = () => {
    startSession();
    router.push("/games");
  };

  return (
    <Screen
      top={
        <>
          <BrandTag />
          <LangToggle />
        </>
      }
      actions={
        hydrated ? (
          <div className="flex flex-col items-center gap-3">
            <Button onClick={start}>{randomize ? t.startShuffled : t.start}</Button>
            <p className="text-xs text-mute/70">{t.responsible}</p>
          </div>
        ) : null
      }
    >
      <section className="pt-4">
        <h1 className="font-condensed text-[5.5rem] leading-[0.82] text-amber drop-shadow-[0_0_24px_rgb(240_182_74/0.25)]">
          TIPSY
        </h1>
        <p className="mt-4 max-w-72 text-[15px] leading-relaxed text-mute">{t.heroLine}</p>
      </section>

      {hydrated ? (
        <form
          className="mt-10 flex animate-rise flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <div className="mb-1 flex items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-4xl font-bold leading-tight text-bone">{t.whoPlaying}</h2>
              <p className="mt-1 text-sm text-mute">{t.whoHint}</p>
            </div>
            <span className="shrink-0 rounded-full bg-white/6 px-3 py-1 text-sm font-semibold text-amber tabular-nums">
              {t.playersCount(count)}
            </span>
          </div>

          <ol className="flex flex-col gap-2.5">
            {names.map((name, i) => {
              const label = name.trim() || t.playerN(i + 1);
              return (
                <li key={i} className="panel flex h-15 items-center rounded-2xl pl-5 pr-1.5 focus-within:border-amber/50">
                  <span className="w-6 shrink-0 text-sm font-bold text-amber tabular-nums">{i + 1}</span>
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
                    onChange={(e) => setNames(names.map((n, j) => (j === i ? e.target.value : n)))}
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
                    className="grid size-11 shrink-0 place-items-center rounded-full text-xl text-mute transition hover:bg-white/6 hover:text-bone active:scale-90 disabled:opacity-20"
                  >
                    ×
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

          <label className="panel mt-5 flex cursor-pointer items-center justify-between gap-4 rounded-2xl px-5 py-4">
            <span className="min-w-0">
              <Label>{t.houseRules}</Label>
              <span className="mt-1 block text-[15px] font-semibold text-bone">{t.randomize}</span>
              <span className="mt-0.5 block text-[13px] text-mute">{t.randomizeHint}</span>
            </span>
            <input
              type="checkbox"
              checked={randomize}
              onChange={(e) => setRandomize(e.target.checked)}
              className="peer sr-only"
            />
            <span
              aria-hidden="true"
              className="relative h-8 w-14 shrink-0 rounded-full border border-line bg-white/8 transition peer-checked:border-amber peer-checked:bg-amber peer-focus-visible:ring-2 peer-focus-visible:ring-amber after:absolute after:left-1 after:top-1 after:size-5.5 after:rounded-full after:bg-bone after:shadow after:transition peer-checked:after:translate-x-6 peer-checked:after:bg-ink"
            />
          </label>
        </form>
      ) : null}
    </Screen>
  );
}
