/** Drink characters used as player icons. Files live in public/images/characters. */
export const CHARACTERS = [
  "beer-mug",
  "red-wine",
  "martini",
  "mojito",
  "margarita",
  "sake",
  "tiki",
  "champagne-bottle",
  "whisky-rocks",
  "sangria",
  "pilsner",
  "white-wine",
  "cosmo",
  "stout",
  "tequila-shot",
  "mulled-wine",
  "blue-lagoon",
  "bloody-mary",
  "cognac",
  "ice-bucket",
  "beer-bottle",
  "champagne-flute",
  "old-fashioned",
  "gin-tonic",
  "salty-dog",
  "vodka-lime",
  "brandy",
  "dark-ale",
  "highball",
  "beer-stein",
] as const;

export type CharacterId = (typeof CHARACTERS)[number];

export function characterSrc(id: string): string {
  return `/images/characters/${id}.webp`;
}

/** A random character nobody else has yet (falls back to any if all are taken). */
export function pickCharacter(taken: readonly string[]): CharacterId {
  const free = CHARACTERS.filter((c) => !taken.includes(c));
  const pool = free.length ? free : CHARACTERS;
  return pool[Math.floor(Math.random() * pool.length)];
}

/** The next character after `current` in the list that nobody else has. */
export function nextCharacter(current: string, taken: readonly string[]): CharacterId {
  const start = CHARACTERS.indexOf(current as CharacterId);
  for (let step = 1; step <= CHARACTERS.length; step++) {
    const c = CHARACTERS[(start + step) % CHARACTERS.length];
    if (!taken.includes(c)) return c;
  }
  return current as CharacterId;
}
