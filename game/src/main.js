// Mira's Cottage — Spot the Difference: game state, input, scoring and rendering.
// One canvas holds both panels side by side; the left panel is the original scene and
// the right panel is the same scene with its differences applied.
import { PANEL_WIDTH, PANEL_HEIGHT, SCENES } from './scenes.js';
import { playFound, playWrong, playHint, playWin, playLose, playTick } from './audio.js';
import { stageShot } from './shots.js';

const GAP = 20;
const MARGIN = 10;
const CANVAS_WIDTH = MARGIN * 2 + PANEL_WIDTH * 2 + GAP;
const CANVAS_HEIGHT = MARGIN * 2 + PANEL_HEIGHT;
const LEFT_X = MARGIN;
const RIGHT_X = MARGIN + PANEL_WIDTH + GAP;
const PANEL_Y = MARGIN;
const POINTS_PER_FIND = 100;
const HINT_COST = 25;
const WRONG_CLICK_COST = 5;
const MAX_HINTS = 3;

const SCREEN_TITLE = 'title';
const SCREEN_PLAY = 'play';
const SCREEN_LEVEL_DONE = 'level-done';
const SCREEN_GAME_DONE = 'game-done';
const SCREEN_TIME_UP = 'time-up';

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const foundCountEl = document.getElementById('found-count');
const scoreEl = document.getElementById('score-value');
const timeEl = document.getElementById('time-value');
const timerFillEl = document.getElementById('timer-fill');
const levelNameEl = document.getElementById('level-name');
const hintButton = document.getElementById('hint-button');
const hintsLeftEl = document.getElementById('hints-left');
const restartButton = document.getElementById('restart-button');
const overlay = document.getElementById('overlay');
const overlayTitle = document.getElementById('overlay-title');
const overlayText = document.getElementById('overlay-text');
const overlayButtons = document.getElementById('overlay-buttons');
const overlayHint = document.getElementById('overlay-hint');
const testlog = document.getElementById('testlog');

const params = new URLSearchParams(window.location.search);

/** The whole game state; one object so a fresh level is a fresh start. */
const game = {
  screen: SCREEN_TITLE,
  levelIndex: 0,
  scene: SCENES[0],
  found: new Set(),
  wrongMarks: [],
  hintMark: null,
  score: 0,
  timeLeft: SCENES[0].timeLimit,
  hintsLeft: MAX_HINTS,
  paused: false,
  lastTickSecond: -1,
  levelBonus: 0,
  totalFound: 0,
  popups: [],
  levelStartScore: 0,
};

function scene() {
  return game.scene;
}

function formatTime(seconds) {
  const whole = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, '0')}`;
}

/** Draw one panel: the scene painter plus a frame and a label. */
function drawPanel(panelX, variant) {
  ctx.save();
  ctx.beginPath();
  ctx.rect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.clip();
  ctx.translate(panelX, PANEL_Y);
  scene().paint(ctx, variant);
  ctx.restore();
  ctx.strokeStyle = '#8a5a12';
  ctx.lineWidth = 4;
  ctx.strokeRect(panelX, PANEL_Y, PANEL_WIDTH, PANEL_HEIGHT);
  ctx.fillStyle = 'rgba(43, 33, 24, 0.75)';
  ctx.fillRect(panelX + 8, PANEL_Y + 8, 96, 26);
  ctx.fillStyle = '#fff6e0';
  ctx.font = 'bold 15px "Trebuchet MS", Verdana, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(variant ? 'Picture B' : 'Picture A', panelX + 18, PANEL_Y + 21);
}

/** A red ring around a found difference, drawn on both panels. */
function drawFoundRing(panelX, diff, pulse) {
  const radius = diff.r + 6 + pulse * 3;
  ctx.strokeStyle = '#e2574c';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(panelX + diff.x, PANEL_Y + diff.y, radius, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = '#fff8e6';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(panelX + diff.x, PANEL_Y + diff.y, radius + 4, 0, Math.PI * 2);
  ctx.stroke();
}

/** The whole frame: both panels, markers, effects and the centre divider. */
function render(now) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#f7e8c8';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  drawPanel(LEFT_X, false);
  drawPanel(RIGHT_X, true);

  // Centre divider with the "find them all" prompt.
  ctx.fillStyle = '#8a5a12';
  ctx.fillRect(LEFT_X + PANEL_WIDTH + 2, PANEL_Y, GAP - 4, PANEL_HEIGHT);
  ctx.save();
  ctx.translate(LEFT_X + PANEL_WIDTH + GAP / 2, PANEL_Y + PANEL_HEIGHT / 2);
  ctx.rotate(-Math.PI / 2);
  ctx.fillStyle = '#fff6e0';
  ctx.font = 'bold 13px "Trebuchet MS", Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('FIND THE DIFFERENCES', 0, 4);
  ctx.restore();

  // Rings on every found difference, on both pictures.
  const pulse = 0.5 + 0.5 * Math.sin(now / 300);
  scene().differences.forEach((diff) => {
    if (!game.found.has(diff.id)) return;
    drawFoundRing(LEFT_X, diff, 0);
    drawFoundRing(RIGHT_X, diff, 0);
  });

  // A pulsing gold ring on the hinted difference.
  if (game.hintMark) {
    const diff = game.hintMark;
    const alpha = 0.55 + 0.45 * Math.sin(now / 150);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = '#ffd94d';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(LEFT_X + diff.x, PANEL_Y + diff.y, diff.r + 10 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(RIGHT_X + diff.x, PANEL_Y + diff.y, diff.r + 10 + pulse * 4, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Fading red X marks where the player clicked wrongly.
  game.wrongMarks = game.wrongMarks.filter((mark) => now - mark.at < 700);
  game.wrongMarks.forEach((mark) => {
    const age = (now - mark.at) / 700;
    ctx.globalAlpha = 1 - age;
    ctx.strokeStyle = '#e2574c';
    ctx.lineWidth = 4;
    const s = 10;
    ctx.beginPath();
    ctx.moveTo(mark.x - s, mark.y - s);
    ctx.lineTo(mark.x + s, mark.y + s);
    ctx.moveTo(mark.x + s, mark.y - s);
    ctx.lineTo(mark.x - s, mark.y + s);
    ctx.stroke();
    ctx.globalAlpha = 1;
  });

  // Floating "+100" popups on each find.
  game.popups = game.popups.filter((popup) => now - popup.at < 900);
  game.popups.forEach((popup) => {
    const age = (now - popup.at) / 900;
    ctx.globalAlpha = 1 - age;
    ctx.fillStyle = '#2e6b34';
    ctx.font = 'bold 22px "Trebuchet MS", Verdana, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(popup.text, popup.x, popup.y - age * 26);
    ctx.globalAlpha = 1;
  });
}

/** Refresh the HUD: counter, score, timer and hint button. */
function updateHud() {
  const total = scene().differences.length;
  foundCountEl.textContent = `${game.found.size} / ${total}`;
  scoreEl.textContent = String(game.score);
  timeEl.textContent = formatTime(game.timeLeft);
  const fraction = Math.max(0, game.timeLeft / scene().timeLimit);
  timerFillEl.style.width = `${fraction * 100}%`;
  timerFillEl.classList.toggle('low', game.timeLeft <= 30);
  timeEl.classList.toggle('low-time', game.timeLeft <= 30);
  hintsLeftEl.textContent = String(game.hintsLeft);
  hintButton.disabled = game.hintsLeft <= 0 || game.screen !== SCREEN_PLAY;
  levelNameEl.textContent = `Level ${game.levelIndex + 1} · ${scene().name}`;
}

/** Show an overlay card; buttons is an array of {label, action, secondary}. */
function showOverlay(title, text, hint, buttons) {
  overlayTitle.textContent = title;
  overlayText.innerHTML = text;
  overlayHint.textContent = hint;
  overlayButtons.innerHTML = '';
  buttons.forEach((button) => {
    const el = document.createElement('button');
    el.type = 'button';
    el.textContent = button.label;
    if (button.secondary) el.classList.add('secondary');
    el.addEventListener('click', button.action);
    overlayButtons.appendChild(el);
  });
  overlay.classList.remove('hidden');
}

function hideOverlay() {
  overlay.classList.add('hidden');
}

/** Start (or restart) a level from scratch. */
function startLevel(levelIndex) {
  game.levelIndex = levelIndex;
  game.scene = SCENES[levelIndex];
  game.found = new Set();
  game.wrongMarks = [];
  game.hintMark = null;
  game.timeLeft = game.scene.timeLimit;
  game.hintsLeft = MAX_HINTS;
  game.paused = false;
  game.lastTickSecond = -1;
  game.levelBonus = 0;
  game.levelStartScore = game.score;
  game.screen = SCREEN_PLAY;
  hideOverlay();
  updateHud();
}

/** Back to the title screen, keeping the total score. */
function showTitle() {
  game.screen = SCREEN_TITLE;
  game.scene = SCENES[0];
  game.levelIndex = 0;
  game.found = new Set();
  game.hintMark = null;
  game.timeLeft = game.scene.timeLimit;
  game.paused = false;
  showOverlay(
    'Mira’s Cottage',
    'Two pictures hang side by side — <b>almost</b> the same. Find every difference before the clock runs out!<br><br>Three rooms to search: the cottage, the garden and the workshop. Each find is worth <b>100 points</b>, and finishing a level banks a time bonus.',
    'Click a difference in either picture · H for a hint · R to restart',
    [
      { label: '▶ Start playing', action: () => { game.score = 0; game.totalFound = 0; startLevel(0); } },
      { label: 'Level 2 · Garden', action: () => { game.score = 0; game.totalFound = 0; startLevel(1); } },
      { label: 'Level 3 · Workshop', action: () => { game.score = 0; game.totalFound = 0; startLevel(2); } },
    ],
  );
  updateHud();
}

/** The level is cleared: bank the time bonus and offer the next room. */
function levelComplete() {
  game.levelBonus = Math.ceil(game.timeLeft) * 5;
  game.score += game.levelBonus;
  game.screen = SCREEN_LEVEL_DONE;
  playWin();
  const isLast = game.levelIndex >= SCENES.length - 1;
  if (isLast) {
    game.screen = SCREEN_GAME_DONE;
    showOverlay(
      'You found them all! 🎉',
      `Every difference in all three rooms — <b>${game.totalFound}</b> in total — and a final score of <b>${game.score}</b> points.<br><br>Mira’s cottage is tidy again. Thank you for playing!`,
      'Press Enter to play again',
      [
        { label: '↺ Play again', action: () => { game.score = 0; game.totalFound = 0; startLevel(0); } },
        { label: 'Title screen', action: showTitle, secondary: true },
      ],
    );
  } else {
    showOverlay(
      `${scene().name} — cleared! ✨`,
      `You found all <b>${scene().differences.length}</b> differences with <b>${formatTime(game.timeLeft)}</b> to spare.<br>Time bonus: <b>+${game.levelBonus}</b> points · Score: <b>${game.score}</b>`,
      'Press Enter for the next room',
      [
        { label: `Next: ${SCENES[game.levelIndex + 1].name} →`, action: () => startLevel(game.levelIndex + 1) },
        { label: 'Replay this level', action: () => startLevel(game.levelIndex), secondary: true },
      ],
    );
  }
  updateHud();
}

/** The clock ran out with differences still hidden. */
function timeUp() {
  game.screen = SCREEN_TIME_UP;
  playLose();
  const remaining = scene().differences.length - game.found.size;
  showOverlay(
    'Out of time! ⏰',
    `<b>${remaining}</b> difference${remaining === 1 ? '' : 's'} still hiding in ${scene().name}.<br>Score so far: <b>${game.score}</b> — have another look?`,
    'Press R to try the level again',
    [
      { label: '↺ Try this level again', action: () => startLevel(game.levelIndex) },
      { label: 'Title screen', action: showTitle, secondary: true },
    ],
  );
  updateHud();
}

/** The nearest unfound difference to a panel-local point, within its radius. */
function differenceAt(x, y) {
  let best = null;
  let bestDistance = Infinity;
  scene().differences.forEach((diff) => {
    if (game.found.has(diff.id)) return;
    const distance = Math.hypot(x - diff.x, y - diff.y);
    if (distance <= diff.r + 14 && distance < bestDistance) {
      best = diff;
      bestDistance = distance;
    }
  });
  return best;
}

/** Handle a click (or tap) on the canvas. */
function handleClick(clientX, clientY) {
  if (game.screen !== SCREEN_PLAY || game.paused) return;
  const rect = canvas.getBoundingClientRect();
  const x = (clientX - rect.left) * (canvas.width / rect.width);
  const y = (clientY - rect.top) * (canvas.height / rect.height);
  let panelX = null;
  if (x >= LEFT_X && x < LEFT_X + PANEL_WIDTH) panelX = LEFT_X;
  else if (x >= RIGHT_X && x < RIGHT_X + PANEL_WIDTH) panelX = RIGHT_X;
  if (panelX === null) return;
  const localX = x - panelX;
  const localY = y - PANEL_Y;
  if (localY < 0 || localY > PANEL_HEIGHT) return;
  const diff = differenceAt(localX, localY);
  if (diff) {
    game.found.add(diff.id);
    game.totalFound += 1;
    game.score += POINTS_PER_FIND;
    game.popups.push({ text: `+${POINTS_PER_FIND} · ${diff.name}`, x, y: y - 10, at: performance.now() });
    playFound();
    if (game.found.size === scene().differences.length) {
      updateHud();
      window.setTimeout(levelComplete, 450);
    }
  } else {
    game.score = Math.max(0, game.score - WRONG_CLICK_COST);
    game.wrongMarks.push({ x, y, at: performance.now() });
    playWrong();
  }
  updateHud();
}

/** Spend a hint: briefly ring one difference the player has not found yet. */
function useHint() {
  if (game.screen !== SCREEN_PLAY || game.paused || game.hintsLeft <= 0) return;
  const remaining = scene().differences.filter((diff) => !game.found.has(diff.id));
  if (remaining.length === 0) return;
  const diff = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintsLeft -= 1;
  game.score = Math.max(0, game.score - HINT_COST);
  game.hintMark = diff;
  playHint();
  window.setTimeout(() => { game.hintMark = null; }, 2200);
  updateHud();
}

/** Pause or resume the clock. */
function togglePause() {
  if (game.screen !== SCREEN_PLAY) return;
  game.paused = !game.paused;
  if (game.paused) {
    showOverlay('Paused ⏸', 'Take a breath — the clock is stopped.', 'Press P to keep hunting', [
      { label: '▶ Keep playing', action: togglePause },
      { label: '↺ Restart level', action: () => startLevel(game.levelIndex), secondary: true },
    ]);
  } else {
    hideOverlay();
  }
}

canvas.addEventListener('click', (event) => handleClick(event.clientX, event.clientY));
hintButton.addEventListener('click', useHint);
restartButton.addEventListener('click', () => {
  if (game.screen === SCREEN_PLAY || game.screen === SCREEN_TIME_UP) startLevel(game.levelIndex);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'h' || event.key === 'H') useHint();
  else if (event.key === 'r' || event.key === 'R') {
    if (game.screen === SCREEN_PLAY || game.screen === SCREEN_TIME_UP) startLevel(game.levelIndex);
  } else if (event.key === 'p' || event.key === 'P') togglePause();
  else if (event.key === 'Enter') {
    if (game.screen === SCREEN_TITLE) { game.score = 0; game.totalFound = 0; startLevel(0); }
    else if (game.screen === SCREEN_LEVEL_DONE) startLevel(game.levelIndex + 1);
    else if (game.screen === SCREEN_GAME_DONE || game.screen === SCREEN_TIME_UP) startLevel(game.levelIndex);
  } else if (event.key === 'Escape' && game.screen !== SCREEN_TITLE) showTitle();
});

/** The game loop: timer, tick sounds and a fresh frame. */
let lastTime = performance.now();
function loop(now) {
  const delta = Math.min(0.1, (now - lastTime) / 1000);
  lastTime = now;
  if (game.screen === SCREEN_PLAY && !game.paused) {
    game.timeLeft -= delta;
    const wholeSecond = Math.ceil(game.timeLeft);
    if (game.timeLeft <= 10 && wholeSecond !== game.lastTickSecond && game.timeLeft > 0) {
      game.lastTickSecond = wholeSecond;
      playTick();
    }
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      updateHud();
      timeUp();
    } else {
      updateHud();
    }
  }
  render(now);
  requestAnimationFrame(loop);
}

/** Report load errors into the page so a headless play-test can see them. */
window.addEventListener('error', (event) => {
  testlog.textContent += `ERROR:${event.message};`;
});

if (params.has('shot')) {
  // Screenshot staging (see shots.js): put the real game into a fixed, lively state.
  stageShot(params, game, { startLevel, showTitle, levelComplete, timeUp }, { SCREEN_TITLE, SCREEN_PLAY, SCREEN_LEVEL_DONE, SCREEN_GAME_DONE, SCREEN_TIME_UP });
} else {
  showTitle();
}

// A scripted play-test hook: ?test=click clicks the first difference for real and
// records what happened, so a headless run can prove the game works.
if (params.get('test') === 'click') {
  window.setTimeout(() => {
    startLevel(0);
    const diff = scene().differences[0];
    handleClick(
      canvas.getBoundingClientRect().left + RIGHT_X + diff.x,
      canvas.getBoundingClientRect().top + PANEL_Y + diff.y,
    );
    testlog.textContent += `TEST:found=${game.found.size} score=${game.score} foundId=${[...game.found][0] ?? 'none'};`;
  }, 400);
}

requestAnimationFrame(loop);
