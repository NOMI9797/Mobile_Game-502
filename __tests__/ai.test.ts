/**
 * Tests for the computer player. Run with: npm test
 */
import {
  Card,
  GameState,
  Pending,
  Rank,
  Suit,
  chooseAiAction,
  createGame,
  gameReducer,
} from '../src/engine';

const c = (id: string): Card => ({
  id,
  rank: id.slice(0, -1) as Rank,
  suit: id.slice(-1) as Suit,
});
const cards = (ids: string) => ids.split(' ').filter(Boolean).map(c);

function makeState(hands: string[], top: string, pending: Pending = null, activeSuit?: Suit): GameState {
  return {
    phase: 'playing',
    players: hands.map((h, i) => ({
      name: `P${i}`,
      isHuman: false,
      hand: cards(h),
      totalScore: 0,
      roundPoints: 0,
      eliminated: false,
    })),
    drawPile: cards('3C 4C 5C 6C 3D 4D'),
    discardPile: [c(top)],
    currentPlayer: 0,
    activeSuit: activeSuit ?? c(top).suit,
    pending,
    roundNumber: 1,
    roundWinner: null,
    gameWinner: null,
    eliminatedThisRound: [],
    message: '',
    error: null,
  };
}

test('passes a 2 penalty on when it can', () => {
  const s = makeState(['2S 5H 9H', 'KD KC KS'], '2H', { kind: 'twos', amount: 2 });
  expect(chooseAiAction(s, 0)).toEqual({ type: 'PLAY_CARD', playerIndex: 0, cardId: '2S' });
});

test('accepts the penalty when it cannot answer', () => {
  const s = makeState(['5H 9H JD', 'KD KC KS'], '2H', { kind: 'twos', amount: 2 });
  expect(chooseAiAction(s, 0).type).toBe('ACCEPT_PENALTY');
});

test('draws when nothing is playable', () => {
  const s = makeState(['5D 9D', 'KD KC KS'], '4C');
  expect(chooseAiAction(s, 0).type).toBe('DRAW_CARD');
});

test('plays the most expensive normal card first', () => {
  const s = makeState(['4H KH 8H JC', 'KD KC KS'], '9H');
  expect(chooseAiAction(s, 0)).toMatchObject({ cardId: '8H' });
});

test('Jack names the suit the bot holds most of', () => {
  const s = makeState(['JC 4D 5D 6D 3S', 'KD KC KS'], '9H');
  expect(chooseAiAction(s, 0)).toMatchObject({ cardId: 'JC', chosenSuit: 'D' });
});

test('plays 7♥ when an opponent is about to go out', () => {
  const s = makeState(['7H KH QS QD QC', 'KD'], '9H');
  expect(chooseAiAction(s, 0)).toMatchObject({ cardId: '7H' });
});

test('all-bot games (2–6 players) always finish without an invalid move', () => {
  for (let g = 0; g < 100; g++) {
    const n = 2 + (g % 5);
    let s = createGame(Array.from({ length: n }, (_, i) => ({ name: `Bot ${i}`, isHuman: false })));
    let steps = 0;
    while (s.phase !== 'gameOver' && steps < 50000) {
      steps++;
      s =
        s.phase === 'roundOver'
          ? gameReducer(s, { type: 'NEXT_ROUND' })
          : gameReducer(s, chooseAiAction(s, s.currentPlayer));
      expect(s.error).toBeNull();
    }
    expect(s.phase).toBe('gameOver');
  }
});
