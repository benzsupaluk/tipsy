"use client";

import Link from "next/link";
import type { Route } from "next";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { GameId } from "@/lib/i18n";
import { useApp } from "@/lib/store";
import { BackLink, LangToggle, Screen } from "./screen";
import { Label, PillButton } from "./ui";

const GAMES: { id: GameId; href: Route; glyph: React.ReactNode }[] = [
  { id: "ladder", href: "/games/ladder", glyph: <span className="text-2xl">↕</span> },
  {
    id: "suit",
    href: "/games/suit",
    glyph: (
      <span className="text-xl tracking-tight">
        ♠<span className="text-suit-red">♥♦</span>♣
      </span>
    ),
  },
  { id: "doraemon", href: "/games/doraemon", glyph: <span className="text-2xl">✳</span> },
];

export function GamePicker() {
  const { t, hydrated, order, reshuffleOrder } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (hydrated && order.length < 2) router.replace("/");
  }, [hydrated, order.length, router]);

  return (
    <Screen
      top={
        <>
          <BackLink href="/" label={t.edit} />
          <LangToggle />
        </>
      }
    >
      {hydrated && order.length >= 2 ? (
        <div className="flex animate-rise flex-col gap-8 pt-4">
          <h1 className="font-condensed text-7xl leading-[0.85] text-amber drop-shadow-[0_0_24px_rgb(240_182_74/0.25)]">
            {t.pickGame}
          </h1>

          <section>
            <div className="flex items-center justify-between gap-3">
              <Label>{t.order}</Label>
              <PillButton onClick={reshuffleOrder} className="min-h-9 px-3 text-xs">
                <ShuffleIcon />
                {t.reshuffleOrder}
              </PillButton>
            </div>
            <ol className="mt-3 flex flex-wrap gap-2">
              {order.map((name, i) => (
                <li key={`${name}-${i}`} className="flex items-center gap-2 rounded-full bg-white/6 py-1.5 pl-2 pr-3.5 text-sm text-bone">
                  <span className="grid size-5 place-items-center rounded-full bg-amber/15 text-[11px] font-bold text-amber">{i + 1}</span>
                  {name}
                </li>
              ))}
            </ol>
          </section>

          <ul className="flex flex-col gap-3">
            {GAMES.map((g, i) => {
              const info = t.games[g.id];
              return (
                <li key={g.id} className="animate-rise" style={{ animationDelay: `${i * 60}ms` }}>
                  <Link
                    href={g.href}
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

          <p className="text-center text-xs text-mute/70">{t.responsible}</p>
        </div>
      ) : null}
    </Screen>
  );
}

function ShuffleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-3.5" aria-hidden="true">
      <path
        d="M3 7h3.5c2 0 3.2.9 4.3 2.6l2.4 3.8c1.1 1.7 2.3 2.6 4.3 2.6H21M3 17h3.5c1.4 0 2.4-.4 3.2-1.2M17.5 4 21 7l-3.5 3M17.5 14l3.5 3-3.5 3M14.3 8.2c.8-.8 1.8-1.2 3.2-1.2H21"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
