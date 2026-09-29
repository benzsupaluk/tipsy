"use client";

import { useApp } from "@/lib/store";
import { Button } from "../ui";

export function CardPair({ left, right }: { left: React.ReactNode; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {left}
      {right}
    </div>
  );
}

export function PassStep({
  outcome,
  deckEmpty,
  nextName,
  onNext,
}: {
  outcome: React.ReactNode;
  deckEmpty: boolean;
  nextName: string;
  onNext: () => void;
}) {
  const { t } = useApp();
  return (
    <div className="flex flex-col gap-3">
      {outcome}
      {deckEmpty ? <p className="text-center text-sm text-amber/90">{t.deckDone}</p> : null}
      <Button onClick={onNext}>{t.passTo(nextName)} →</Button>
    </div>
  );
}

export function Question({ children }: { children: React.ReactNode }) {
  return <p className="mb-3 text-center text-sm text-mute short:hidden">{children}</p>;
}
