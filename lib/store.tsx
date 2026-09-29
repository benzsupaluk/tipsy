"use client";

import { createContext, use, useState, useSyncExternalStore } from "react";
import { shuffle } from "./cards";
import { dict, LANG_COOKIE, type Dict, type Lang } from "./i18n";

const STORAGE_KEY = "tipsy:players:v1";

export type Players = {
  names: string[];
  randomize: boolean;
  /** Final play order used by the games. */
  order: string[];
};

const DEFAULT_PLAYERS: Players = {
  names: ["", "", "", ""],
  randomize: false,
  order: [],
};

/* ---- localStorage-backed external store ---- */

const listeners = new Set<() => void>();
let cache: Players | null = null;

function readPlayers(): Players {
  if (cache) return cache;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    cache = raw ? { ...DEFAULT_PLAYERS, ...(JSON.parse(raw) as Partial<Players>) } : DEFAULT_PLAYERS;
  } catch {
    cache = DEFAULT_PLAYERS;
  }
  return cache;
}

function writePlayers(update: (p: Players) => Players) {
  cache = update(readPlayers());
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // storage unavailable: state still lives in memory for this tab
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== STORAGE_KEY) return;
    cache = null;
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const serverSnapshot = () => null;

/* ---- context ---- */

type AppContext = Players & {
  lang: Lang;
  /** False during SSR and the first client render, before localStorage is read. */
  hydrated: boolean;
  t: Dict;
  setLang: (lang: Lang) => void;
  setNames: (names: string[]) => void;
  setRandomize: (value: boolean) => void;
  startSession: () => void;
  reshuffleOrder: () => void;
};

const Ctx = createContext<AppContext | null>(null);

export function resolveNames(names: string[], t: Dict): string[] {
  return names.map((n, i) => n.trim() || t.playerN(i + 1));
}

export function AppProvider({ initialLang, children }: { initialLang: Lang; children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);
  const stored = useSyncExternalStore(subscribe, readPlayers, serverSnapshot);
  const players = stored ?? DEFAULT_PLAYERS;
  const t = dict[lang];

  const value: AppContext = {
    ...players,
    lang,
    hydrated: stored !== null,
    t,
    setLang: (next) => {
      setLangState(next);
      document.documentElement.lang = next;
      document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    },
    setNames: (names) => writePlayers((p) => ({ ...p, names })),
    setRandomize: (randomize) => writePlayers((p) => ({ ...p, randomize })),
    startSession: () =>
      writePlayers((p) => {
        const resolved = resolveNames(p.names, t);
        return { ...p, order: p.randomize ? shuffle(resolved) : resolved };
      }),
    reshuffleOrder: () => writePlayers((p) => ({ ...p, order: shuffle(p.order) })),
  };

  return <Ctx value={value}>{children}</Ctx>;
}

export function useApp(): AppContext {
  const ctx = use(Ctx);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}

/** Rotating turn pointer over the play order. */
export function useTurns(order: string[]) {
  const [turn, setTurn] = useState(0);
  const n = Math.max(order.length, 1);
  const index = turn % n;
  return {
    /** 1-based round counter. */
    round: turn + 1,
    index,
    current: order[index] ?? "",
    /** Next in play order, i.e. the player on the left. */
    next: order[(index + 1) % n] ?? "",
    /** Previous in play order, i.e. the player on the right. */
    prev: order[(index - 1 + n) % n] ?? "",
    advance: () => setTurn((x) => x + 1),
  };
}
