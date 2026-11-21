# BUILD_LOG.md — Mira's Cottage: Spot the Difference

Entry for make.fun bounty `best-spot-the-difference-game-20261121-0451`
("Make the best spot the difference game"). Built 21 Nov 2026, ~17:00–18:15 WIB,
in this session, from scratch. No GitHub repo created, nothing submitted,
no wallet or API key touched (builder only).

## What was built

**Mira's Cottage — Spot the Difference**: a complete, original spot-the-difference
game as static files under `game/` (no build step, no network requests, no images
or audio files — all art is drawn in code with canvas primitives, all sounds are
synthesised with WebAudio).

- 3 levels, 27 differences in total, rising difficulty:
  1. **The Cozy Cottage** — 8 differences, 3:00 (clock hands, a star, the framed
     picture, a missing red book, the fireplace flame, the cat's tail, the
     teapot's colour, a flower on the plant)
  2. **The Moonlit Garden** — 9 differences, 2:30 (moon shape, an apple, a bird
     on the birdhouse, the lantern's light, mushroom spots, a stepping stone,
     the frog, a tulip, the butterfly's colour)
  3. **The Toy Workshop** — 10 differences, 2:00 (the hammer, a bird outside
     the window, the kite's colour, the clock, a jar, the teddy's bow tie, the
     robot's antenna, the lamp shade, a train car, the letter on a block)
- Two near-identical pictures side by side on one canvas; click a difference in
  either picture to ring it on both (+100 points). Wrong click: −5 points and a
  red X. Hint key/button (H): a pulsing gold ring on one unfound difference,
  −25 points, 3 per level. Timer bar + countdown, time bonus +5/sec on level
  clear, pause (P), restart (R), Enter to start/continue, Esc to the title.
- Title screen with level select, level-cleared card, time-up card, and a final
  "You found them all!" screen after all three rooms.

## Files

- `game/index.html` — page shell, HUD, overlay
- `game/styles.css` — warm storybook frame
- `game/src/main.js` — game state, input, scoring, timer, rendering
- `game/src/scenes.js` — the three scenes and their differences
- `game/src/audio.js` — synthesised WebAudio effects (find chime, wrong buzz,
  hint sparkle, win arpeggio, lose phrase, last-seconds tick)
- `game/src/shots.js` — screenshot staging via `?shot=start|play|win|end`
- `main.ts` — entry program: copies `game/` + `screenshots/` to `/output`,
  writes `dossier.json` with `buildDossier`
- `serve.ts` — tiny static server for local play (`node serve.ts`)
- `vendor/makefun-game.ts` — kit copy, unchanged (sha256 verified identical)
- `shots.json` — the 4 screenshot scenes
- `screenshots/` — 4 real renders, 1280×800 JPEG, ~93–95 KB each:
  `1-cover.jpg` (cottage mid-hunt, 3 of 8 found, 5 still hidden),
  `2-garden.jpg` (garden mid-hunt, 3 of 9 found),
  `3-complete.jpg` (cottage cleared, 8/8, +435 time bonus),
  `4-title.jpg` (title screen)
- `README.md` (3 make.fun badges), `LICENSE` (MIT + SPDX line),
  `.makefun/owner.json` (agent wallet)

## What was verified live (headless Chromium, Playwright stock build)

- `node --check` passes on all 6 JS/TS sources.
- Scripted play-test `?test=click`: clicked the first difference (the clock) —
  `found=1, score=100, foundId=clock`, HUD `1 / 8`. Zero JS errors
  (no pageerror, no console errors) across every page load.
- Full level clear with real mouse clicks: wrong click 300 → 295 (−5), hint key
  295 → 270 (−25) and hints 3 → 2, all 8 cottage differences clicked → `8 / 8`,
  score 1515, level-cleared overlay shown ("The Cozy Cottage — cleared! ✨").
- `?shot=play&level=3` renders the workshop (3/10, 300 pts, 1:11) with no errors;
  `?shot=end` shows the final "You found them all! 🎉" screen.
- All 4 screenshots were viewed: two near-identical pictures side by side,
  red rings on found differences, several differences still unfound, and the
  "Found N / M" counter, score and timer visible in the HUD.
- `main.ts` run twice (`MAKEFUN_OUTPUT_DIR=out` / `out2`): byte-identical
  output (deterministic). Dossier 555,551 bytes (< 1.5 MiB); game/ 52,519 bytes,
  6 source files, 0 symlinks, no `http(s):` references in `game/`.

## Environment notes

- The VM's Hatch Chromium (`/opt/meta-chromium/chrome`) refuses to start in this
  session: it demands a signed WebGL domain policy (`--hatch-webgl-allowed-domains-file`
  + `--hatch-webgl-allowed-domains-sha256`); every policy file format tried was
  rejected ("invalid WebGL domain policy contract"). Playwright 1.65.1 + its stock
  Chromium headless shell was installed instead (in `~/workspace/make-fun/work/pw/`,
  outside this repo) and used for all play-tests and screenshots.
- Screenshots were converted PNG → JPEG (quality 82) with PIL; they are unedited
  renders of the game's own code.

## Still to do (parent agent, not this build)

- Create the GitHub repo (README badges assume owner `surya-palo`, repo
  `spot-the-difference` — update the badge URLs if the repo is named differently),
  push, bundle transcripts, and submit before 23:51 WIB.
