"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";
import { useWakeLock } from "@/lib/device";
import { SETUP_HREF, type GameId } from "@/lib/games";
import { useApp } from "@/lib/store";
import { PlayerIcon } from "./player-icon";
import { LangToggle, Screen } from "./screen";
import { Badge, Button, PillButton } from "./ui";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";

type Props = {
  gameId: GameId;
  gameName: string;
  round: number;
  current: string;
  currentIcon: string;
  next: string;
  nextIcon: string;
  rules: React.ReactNode;
  /** Set once the current turn is over: turns the "next up" line into a pass-to-next-player button. */
  onPassNext?: () => void;
  /** Pinned to the bottom of the screen, in thumb reach. */
  actions: React.ReactNode;
  children: React.ReactNode;
};

export function GameShell({ gameId, gameName, round, current, currentIcon, next, nextIcon, rules, onPassNext, actions, children }: Props) {
  const { t, hydrated, order } = useApp();
  const router = useRouter();
  const [rulesOpen, setRulesOpen] = useState(false);
  const ready = hydrated && order.length >= 2;
  useWakeLock();

  useEffect(() => {
    if (hydrated && order.length < 2) router.replace(SETUP_HREF[gameId]);
  }, [hydrated, order.length, router, gameId]);

  const disabledNextPlayer = !onPassNext;

  if (!ready) return <Screen>{null}</Screen>;

  return (
    <>
      <Screen
        top={
          <>
            <div className="flex min-w-0 items-center gap-2.5">
              <Badge className="truncate">{gameName}</Badge>
            </div>
            <div className="-mr-2 flex shrink-0 items-center">
              <button
                type="button"
                onClick={() => setRulesOpen(true)}
                className="min-h-11 rounded-full px-3 text-sm text-mute transition hover:text-bone"
              >
                {t.rules}
              </button>
              <EndGameDrawer onConfirm={() => router.push("/")} />
            </div>
          </>
        }
        actions={actions}
      >
        <div className="flex items-center gap-3 pt-3 short:pt-0">
          <PlayerIcon key={`icon-${current}`} id={currentIcon} size={56} className="animate-pop short:size-11" />
          <h1 key={current} className="min-w-0 animate-rise truncate font-display text-4xl leading-tight font-bold text-bone">
            {current}
          </h1>
        </div>
        <div className="mt-1 flex justify-end">
          <button
            type="button"
            onClick={onPassNext}
            disabled={disabledNextPlayer}
            className="flex min-h-11 items-center gap-1.5 rounded-full border border-amber/60 bg-amber/10 pr-3 pl-2 text-sm font-semibold text-amber transition enabled:animate-pop enabled:hover:bg-amber/20 enabled:active:scale-[0.97] disabled:opacity-50"
          >
            <PlayerIcon id={nextIcon} size={22} />
            {t.passTo(next)}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-start gap-5 py-3 short:gap-3">{children}</div>
      </Screen>

      {rulesOpen ? (
        <RulesSheet title={`${t.rules} · ${gameName}`} onClose={() => setRulesOpen(false)}>
          {rules}
        </RulesSheet>
      ) : null}
    </>
  );
}

function EndGameDrawer({ onConfirm }: { onConfirm: () => void }) {
  const { t } = useApp();

  return (
    <Drawer>
      <DrawerTrigger className="min-h-11 rounded-full px-3 text-sm text-mute transition hover:text-bone">{t.endGame}</DrawerTrigger>
      <DrawerContent className="mx-auto max-w-md bg-surface">
        <div className="px-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
          <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/15" aria-hidden="true" />
          <DrawerHeader className="px-0 pt-4">
            <DrawerTitle className="font-display text-2xl font-bold text-bone">{t.endGameTitle}</DrawerTitle>
            <DrawerDescription className="text-mute">{t.endGameHint}</DrawerDescription>
          </DrawerHeader>
          <div className="mt-6 flex flex-col gap-3">
            <DrawerClose render={<Button />}>{t.keepPlaying}</DrawerClose>
            <Button variant="ghost" onClick={onConfirm} className="border-danger/40 text-danger hover:bg-danger/10">
              {t.endGame}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function RulesSheet({ onClose, title, children }: { onClose: () => void; title: string; children: React.ReactNode }) {
  const { t } = useApp();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-50 flex items-end justify-center">
      <button type="button" aria-label={t.close} onClick={onClose} className="absolute inset-0 animate-fade bg-black/70 backdrop-blur-sm" />
      <div className="relative flex max-h-[88dvh] w-full max-w-md animate-sheet flex-col rounded-t-3xl border border-b-0 border-line bg-surface shadow-2xl">
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-white/15" aria-hidden="true" />
        <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
          <h2 className="font-display text-2xl font-bold text-bone">{title}</h2>
          <LangToggle />
        </div>
        <div className="overflow-y-auto px-5 pb-4 text-[15px] leading-relaxed text-bone/90">{children}</div>
        <div className="px-5 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]">
          <PillButton onClick={onClose} className="min-h-12 w-full">
            {t.close}
          </PillButton>
        </div>
      </div>
    </div>
  );
}

export function RuleList({ items }: { items: string[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {items.map((r, i) => (
        <li key={i} className="flex gap-3">
          <span className="w-4 shrink-0 font-bold text-amber tabular-nums">{i + 1}</span>
          <span>{r}</span>
        </li>
      ))}
    </ol>
  );
}

export type Outcome = { tone: "safe" | "drink" | "all"; text: string; detail?: string };

const tones: Record<Outcome["tone"], { box: string; text: string; icon: string }> = {
  safe: { box: "animate-pop border-safe/35 bg-safe/8", text: "text-safe", icon: "✓" },
  drink: {
    box: "border-2 border-[#ff3b30] bg-radial-[at_20%_50%] from-[#ff3b30]/45 via-[#b3121b]/30 to-[#3a0a0e]/60 motion-safe:[animation:var(--animate-boom),var(--animate-fuse)]",
    text: "text-white drop-shadow-[0_0_8px_rgb(255_59_48/0.8)]",
    icon: "💥",
  },
  all: { box: "animate-pop border-amber/50 bg-amber/10", text: "text-amber", icon: "🍻" },
};

/** `player` and `icon` are the name and character of the player the outcome is about. */
export function OutcomeBanner({ outcome, player, icon }: { outcome: Outcome; player?: string; icon?: string }) {
  const tone = tones[outcome.tone];
  const lost = outcome.tone === "drink";
  return (
    <div role="status" className={`relative mb-2 flex flex-col items-center gap-4 rounded-lg border px-5 py-4 ${tone.box}`}>
      {lost ? (
        <>
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-lg border-2 border-[#ffb199] motion-safe:animate-shockwave motion-reduce:hidden"
          />
          <span aria-hidden="true" className="pointer-events-none absolute -top-3 -right-2 rotate-12 text-3xl motion-safe:animate-pop">
            {tone.icon}
          </span>
        </>
      ) : null}
      <div className="flex min-w-0 flex-col items-center gap-1 text-center">
        {player || icon ? (
          <p className={`flex max-w-full items-center gap-1.5 text-base font-semibold ${lost ? "text-white/85" : "text-bone/80"}`}>
            {icon ? <PlayerIcon id={icon} size={22} /> : null}
            <span className="truncate">{player}</span>
          </p>
        ) : null}
        <p className={`text-3xl leading-tight font-bold ${tone.text}`}>{outcome.text}</p>
      </div>
    </div>
  );
}
