"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWakeLock } from "@/lib/device";
import { useApp } from "@/lib/store";
import { LangToggle, Screen } from "./screen";
import { Badge, PillButton } from "./ui";

type Props = {
  gameName: string;
  round: number;
  current: string;
  next: string;
  cardsLeft: number;
  rules: React.ReactNode;
  /** Pinned to the bottom of the screen, in thumb reach. */
  actions: React.ReactNode;
  children: React.ReactNode;
};

export function GameShell({ gameName, round, current, next, cardsLeft, rules, actions, children }: Props) {
  const { t, hydrated, order } = useApp();
  const router = useRouter();
  const [rulesOpen, setRulesOpen] = useState(false);
  const ready = hydrated && order.length >= 2;
  useWakeLock();

  useEffect(() => {
    if (hydrated && order.length < 2) router.replace("/");
  }, [hydrated, order.length, router]);

  if (!ready) return <Screen>{null}</Screen>;

  return (
    <>
      <Screen
        top={
          <>
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="label-caps shrink-0 text-mute tabular-nums">{t.round(round)}</span>
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
              <Link href="/games" className="inline-flex min-h-11 items-center rounded-full px-3 text-sm text-mute transition hover:text-bone">
                {t.endGame}
              </Link>
            </div>
          </>
        }
        actions={actions}
      >
        <div className="flex items-baseline gap-3 pt-3 short:pt-0">
          <h1 key={current} className="min-w-0 animate-rise truncate font-display text-5xl font-bold leading-tight text-bone short:text-4xl">
            {current}
          </h1>
          <span className="shrink-0 text-sm text-mute">{t.yourTurn}</span>
        </div>
        <p className="mt-1 text-sm text-mute">
          {t.nextUp(next)} <span className="px-1 text-mute/40">·</span> {t.cardsLeft(cardsLeft)}
        </p>

        <div className="flex flex-1 flex-col justify-center gap-5 py-6 short:gap-3 short:py-3">{children}</div>
      </Screen>

      {rulesOpen ? (
        <RulesSheet title={`${t.rules} · ${gameName}`} onClose={() => setRulesOpen(false)}>
          {rules}
        </RulesSheet>
      ) : null}
    </>
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
        <div className="flex items-center justify-between gap-3 px-5 pb-3 pt-4">
          <h2 className="font-display text-2xl font-bold text-bone">{title}</h2>
          <LangToggle />
        </div>
        <div className="overflow-y-auto px-5 pb-4 text-[15px] leading-relaxed text-bone/90">{children}</div>
        <div className="px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-2">
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
  safe: { box: "border-safe/35 bg-safe/8", text: "text-safe", icon: "✓" },
  drink: { box: "border-danger/40 bg-danger/8", text: "text-danger", icon: "🥃" },
  all: { box: "border-amber/50 bg-amber/10", text: "text-amber", icon: "🍻" },
};

export function OutcomeBanner({ outcome }: { outcome: Outcome }) {
  const tone = tones[outcome.tone];
  return (
    <div role="status" className={`flex animate-pop items-center gap-4 rounded-2xl border px-5 py-4 ${tone.box}`}>
      <span className={`text-3xl leading-none ${tone.text}`} aria-hidden="true">
        {tone.icon}
      </span>
      <div className="min-w-0">
        <p className={`text-xl font-bold leading-snug ${tone.text}`}>{outcome.text}</p>
        {outcome.detail ? <p className="mt-0.5 text-sm text-mute">{outcome.detail}</p> : null}
      </div>
    </div>
  );
}
