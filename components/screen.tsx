"use client";

import Link from "next/link";
import type { Route } from "next";
import { useApp } from "@/lib/store";
import type { Lang } from "@/lib/i18n";

/**
 * Mobile screen scaffold: top bar, scrollable content, and an action bar that
 * sticks to the bottom so primary actions stay in thumb reach.
 */
export function Screen({
  top,
  children,
  actions,
}: {
  top?: React.ReactNode;
  children: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-5 pt-[max(env(safe-area-inset-top),0.75rem)]">
      {top ? <div className="flex min-h-14 items-center justify-between gap-3">{top}</div> : null}
      <main className="flex flex-1 flex-col">{children}</main>
      {actions ? (
        <div className="sticky bottom-0 z-20 -mx-5 mt-4 bg-linear-to-t from-ink from-70% to-transparent px-5 pb-[max(env(safe-area-inset-bottom),1rem)] pt-8">
          {actions}
        </div>
      ) : (
        <div className="h-[max(env(safe-area-inset-bottom),1rem)]" />
      )}
    </div>
  );
}

export function BackLink({ href, label }: { href: Route; label?: string }) {
  const { t } = useApp();
  return (
    <Link
      href={href}
      className="-ml-2 inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-sm text-mute transition hover:text-bone"
    >
      <span aria-hidden="true">←</span>
      {label ?? t.back}
    </Link>
  );
}

export function BrandTag() {
  const { t } = useApp();
  return (
    <p className="flex items-center gap-2.5 label-caps text-mute">
      <span className="size-2 animate-pulse-dot rounded-full bg-amber" aria-hidden="true" />
      {t.brandTag}
    </p>
  );
}

export function LangToggle() {
  const { t, lang, setLang } = useApp();
  return (
    <div role="group" aria-label={t.langLabel} className="flex rounded-full border border-line bg-white/4 p-1">
      {(["th", "en"] as const satisfies Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          aria-pressed={lang === l}
          onClick={() => setLang(l)}
          className={`h-9 min-w-11 rounded-full px-3 text-xs font-bold tracking-wider transition ${
            lang === l ? "bg-amber text-ink" : "text-mute hover:text-bone"
          }`}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
