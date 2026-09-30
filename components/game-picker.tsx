"use client";

import Link from "next/link";
import { SETUP_HREF, type GameId } from "@/lib/games";
import { useApp } from "@/lib/store";
import { DonateDrawer } from "./donate-drawer";
import { BrandTag, LangToggle, Screen } from "./screen";
import { Label } from "./ui";

const GAMES: { id: GameId; glyph: React.ReactNode }[] = [
  { id: "ladder", glyph: <span className="text-2xl">↕</span> },
  {
    id: "suit",
    glyph: (
      <span className="text-xl tracking-tight">
        ♠<span className="text-suit-red">♥♦</span>♣
      </span>
    ),
  },
  { id: "doraemon", glyph: <span className="text-2xl">✳</span> },
];

export function GamePicker() {
  const { t } = useApp();

  return (
    <Screen
      top={
        <>
          <BrandTag />
          <LangToggle />
        </>
      }
    >
      <section className="pt-4">
        <h1 className="font-condensed text-[5.5rem] leading-[0.82] text-amber drop-shadow-[0_0_24px_rgb(240_182_74/0.25)]">
          TIPSY
        </h1>
        {t.heroLine ? <p className="mt-4 max-w-72 text-[15px] leading-relaxed text-mute">{t.heroLine}</p> : null}
      </section>

      <section className="mt-10">
        <Label>{t.pickGame}</Label>
        <ul className="mt-3 flex flex-col gap-3">
          {GAMES.map((g, i) => {
            const info = t.games[g.id];
            return (
              <li key={g.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                <Link
                  href={SETUP_HREF[g.id]}
                  className="panel flex min-h-22 items-center justify-between gap-4 rounded-2xl px-5 py-4 transition hover:border-amber/60 hover:bg-amber/6 active:scale-[0.98] active:border-amber"
                >
                  <div className="min-w-0">
                    <p className="text-xl font-bold text-bone">{info.name}</p>
                    <p className="mt-0.5 text-sm text-mute">{info.desc}</p>
                  </div>
                  <span className="shrink-0 text-amber" aria-hidden="true">
                    {g.glyph}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-auto flex justify-center pt-10">
        <DonateDrawer />
      </div>
    </Screen>
  );
}
