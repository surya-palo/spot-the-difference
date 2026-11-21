# spot-the-difference

[![make.fun · best-spot-the-difference-game-20261121-0451](https://make.fun/badge/best-spot-the-difference-game-20261121-0451.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![rank](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/surya-palo/spot-the-difference/rank.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)
[![reward](https://make.fun/badge/best-spot-the-difference-game-20261121-0451/surya-palo/spot-the-difference/reward.svg)](https://make.fun/bounty/best-spot-the-difference-game-20261121-0451?utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)

**Mira's Cottage — Spot the Difference**: a complete, original spot-the-difference game that plays offline in a desktop browser. Two near-identical pictures hang side by side — a cozy cottage, a moonlit garden, and a toy workshop — and 27 small changes hide between them. Click a difference in either picture to ring it, beat the clock, and clear all three rooms.

## How to play

- **Click** a difference in either picture to circle it (+100 points). A wrong click costs 5 points and leaves a red X.
- **H** spends a hint (−25 points, 3 per level): a gold ring pulses around a difference you have not found yet.
- **R** restarts the level, **P** pauses, **Enter** starts or continues, **Esc** goes back to the title screen.
- Finishing a level banks a time bonus (+5 points per second left). Find all 27 differences to win.

## Levels

1. **The Cozy Cottage** — 8 differences, 3:00 (a sleeping cat, a kettle, a fire that burns low)
2. **The Moonlit Garden** — 9 differences, 2:30 (a frog, a crescent moon, a dark lantern)
3. **The Toy Workshop** — 10 differences, 2:00 (a missing hammer, a train car, a letter on a block)

Every scene is original art drawn in code with canvas primitives — no images, no copied art. Sounds are synthesised with WebAudio (a chime on each find, a buzz on a miss, an arpeggio on a win); there are no audio files and no network requests.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in desktop Chrome. Or open `game/index.html` from any static server — the game is plain files under `game/` with no build step.

Screenshot scenes (used to take the screenshots in `screenshots/`): `?shot=start`, `?shot=play&level=1`, `?shot=play&level=2`, `?shot=win&level=1`, `?shot=end`.

## Layout

- `game/index.html` — page shell, HUD, overlay
- `game/styles.css` — the warm storybook frame
- `game/src/main.js` — game state, input, scoring, timer, rendering
- `game/src/scenes.js` — the three scenes and their differences
- `game/src/audio.js` — synthesised WebAudio sound effects
- `game/src/shots.js` — screenshot staging (`?shot=…`)
- `main.ts` — the entry program: copies `game/` and `screenshots/` to `/output` and writes `dossier.json`
- `screenshots/` — 4 real renders of the game (cover first)

---

<sub>Entered on [make.fun](https://make.fun/?ref=5zv4vr8w&utm_source=github&utm_medium=readme&utm_campaign=best-spot-the-difference-game-20261121-0451)</sub>
