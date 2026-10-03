# Tipsy promo video

Instagram Reel / Story intro for tipsyparty.co, built with [Remotion](https://www.remotion.dev).
Kept out of the Next.js app on purpose: its own `package.json`, excluded from the root tsconfig, eslint and prettier.

- 1080×1920, 30fps, ~20s, no audio (add a trending track inside Instagram)
- Character art comes straight from `../public` (see `remotion.config.ts`)
- Colors and fonts mirror `app/globals.css`, copy lives in `src/copy.ts`

```bash
pnpm install
pnpm studio        # live preview / scrub timeline
pnpm render        # out/tipsy-reel-th.mp4
pnpm render:en     # out/tipsy-reel-en.mp4
pnpm render:cover  # out/tipsy-cover.png (Reel cover)
pnpm render:all
```

Scene order: hook → TIPSY reveal → Ladder → Call the Suit → Doraemon → free / no app → CTA.
Scene lengths are in `SCENES` in `src/reel.tsx`. Text stays out of the top ~220px and bottom ~420px, where Instagram draws its UI.
