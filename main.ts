// Mira's Cottage — Spot the Difference: the entry program (Node 22, standard library
// only). It hands the game in: it copies this repository's game/ and screenshots/
// beside this file into /output (or MAKEFUN_OUTPUT_DIR outside the grader) and writes
// /output/dossier.json, the summary the judge reads, with the vendored make.fun
// library. It runs twice and must write the same bytes both times.
//
// Check it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

/** Copy a directory from the repo into the output, creating the target first. */
function copyIntoOutput(name) {
  const source = join(repoRoot, name);
  const target = join(outputDir, name);
  mkdirSync(target, { recursive: true });
  if (existsSync(source)) cpSync(source, target, { recursive: true });
}

mkdirSync(outputDir, { recursive: true });
copyIntoOutput('game');
copyIntoOutput('screenshots');

// The gate's own caps, so a bad entry is refused here instead of at the scorer:
// at most 4 screenshots of 256 KiB, game/ at most 993 files and 48 MiB, and a
// dossier text of at most 160 KiB.
writeFileSync(
  join(outputDir, 'dossier.json'),
  buildDossier(outputDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
