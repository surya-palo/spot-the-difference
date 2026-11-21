// Screenshot scenes for Mira's Cottage: ?shot= puts the real game into a fixed,
// lively state, so a screenshot is what a short game really looks like.
//   ?shot=start            title screen over the cottage
//   ?shot=play&level=1     mid-hunt, three differences already ringed, more to find
//   ?shot=play&level=2     the garden mid-hunt, two differences ringed
//   ?shot=win&level=1      the level-cleared card
//   ?shot=end              all three rooms cleared
// The staged states play by the same rules as a human game: found differences are
// added to the real found set and the score is the real score for those finds.
import { SCENES } from './scenes.js';

/** Which differences are already ringed in each play shot (spread across the scene). */
const PLAY_FOUND = {
  1: [0, 4, 6],
  2: [1, 5, 7],
  3: [2, 5, 8],
};

/** The clock reading each play shot shows. */
const PLAY_TIME_LEFT = { 1: 154, 2: 98, 3: 71 };

/**
 * Stage the named shot. `game` is the live state object from main.js, `actions`
 * are its startLevel/showTitle/levelComplete/timeUp functions, and `screens` are
 * its screen-name constants.
 */
export function stageShot(params, game, actions, screens) {
  const shot = params.get('shot') ?? 'start';
  const level = Math.min(3, Math.max(1, Number(params.get('level') ?? 1) || 1));

  if (shot === 'play') {
    actions.startLevel(level - 1);
    const indices = PLAY_FOUND[level] ?? [0, 1, 2];
    indices.forEach((index) => {
      const diff = game.scene.differences[index];
      if (diff) game.found.add(diff.id);
    });
    game.totalFound += game.found.size;
    game.score = game.found.size * 100;
    game.timeLeft = PLAY_TIME_LEFT[level] ?? 120;
    game.screen = screens.SCREEN_PLAY;
    return;
  }

  if (shot === 'win') {
    actions.startLevel(level - 1);
    game.scene.differences.forEach((diff) => game.found.add(diff.id));
    game.totalFound += game.found.size;
    game.score = game.found.size * 100;
    game.timeLeft = 87;
    actions.levelComplete();
    return;
  }

  if (shot === 'end') {
    actions.startLevel(2);
    game.scene.differences.forEach((diff) => game.found.add(diff.id));
    game.totalFound = SCENES[0].differences.length + SCENES[1].differences.length + SCENES[2].differences.length;
    game.score = game.totalFound * 100 + 435 + 490 + 355;
    game.timeLeft = 63;
    actions.levelComplete();
    return;
  }

  actions.showTitle();
}
