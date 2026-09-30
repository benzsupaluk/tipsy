import type { Route } from "next";

export const GAME_IDS = ["ladder", "suit", "doraemon"] as const;

export type GameId = (typeof GAME_IDS)[number];

export function isGameId(value: string): value is GameId {
  return (GAME_IDS as readonly string[]).includes(value);
}

/** Where the game itself is played. */
export const PLAY_HREF = {
  ladder: "/games/ladder",
  suit: "/games/suit",
  doraemon: "/games/doraemon",
} as const satisfies { [K in GameId]: Route<`/games/${K}`> };

/** Player setup screen shown after picking a game. */
export const SETUP_HREF = {
  ladder: "/setup/ladder",
  suit: "/setup/suit",
  doraemon: "/setup/doraemon",
} as const satisfies { [K in GameId]: Route<`/setup/${K}`> };
