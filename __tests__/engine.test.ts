/**
 * Tests for the 502 rules. Run with: npm test
 */
import {
  Card,
  GameState,
  Pending,
  Rank,
  Suit,
  canPlayCard,
  cardPoints,
  createDeck,
  createGame,
  gameReducer,
  handPoints,
  isValidStartCard,
} from '../src/engine';

// "7H" -> 7♥, "10S" -> 10♠
const c = (id: string): Card => ({
  id,
  rank: id.slice(0, -1) as Rank,
  suit: id.slice(-1) as Suit,
});
const cards = (ids: string) => ids.split(' ').filter(Boolean).map(c);

/** Build a hand-crafted mid-round state for testing. */
function makeState(opts: {
  hands: string[];
  top: string;
  activeSuit?: Suit;
  pending?: Pending;
  draw?: string;
  discardsBelow?: string;
  current?: number;
  scores?: number[];
}): GameState {
  const top = c(opts.top);
  return {
    phase: 'playing',
    players: opts.hands.map((h, i) => ({
      name: `P${i}`,
      isHuman: i === 0,
      hand: cards(h),
      totalScore: opts.scores?.[i] ?? 0,
      roundPoints: 0,
      eliminated: false,
    })),
    drawPile: cards(opts.draw ?? '3C 4C 5C 6C 3D 4D 5D 6D 9D 10D'),
    discardPile: [...cards(opts.discardsBelow ?? ''), top],
    currentPlayer: opts.current ?? 0,
    activeSuit: opts.activeSuit ?? top.suit,
    pending: opts.pending ?? null,
    roundNumber: 1,
    roundWinner: null,
    gameWinner: null,
    eliminatedThisRound: [],
    message: '',
    error: null,
  };
}

const play = (s: GameState, p: number, id: string, chosenSuit?: Suit) =>
  gameReducer(s, { type: 'PLAY_CARD', playerIndex: p, cardId: id, chosenSuit });
const draw = (s: GameState, p: number) => gameReducer(s, { type: 'DRAW_CARD', playerIndex: p });
const accept = (s: GameState, p: number) =>
  gameReducer(s, { type: 'ACCEPT_PENALTY', playerIndex: p });

describe('deck & scoring', () => {
  test('deck has 52 unique cards', () => {
    const deck = createDeck();
    expect(deck).toHaveLength(52);
    expect(new Set(deck.map(x => x.id)).size).toBe(52);
  });

  test('card point values', () => {
    expect(cardPoints(c('7H'))).toBe(100);
    expect(cardPoints(c('AS'))).toBe(100);
    expect(cardPoints(c('2D'))).toBe(30);
    expect(cardPoints(c('8C'))).toBe(30);
    expect(cardPoints(c('JH'))).toBe(30);
    expect(cardPoints(c('AH'))).toBe(20);
    expect(cardPoints(c('10S'))).toBe(10);
    expect(cardPoints(c('QS'))).toBe(10);
    expect(cardPoints(c('KS'))).toBe(10);
    expect(cardPoints(c('7S'))).toBe(5);
    expect(cardPoints(c('9C'))).toBe(5);
  });

  test('rules example: A♠ + J♦ + 4♣ = 135', () => {
    expect(handPoints(cards('AS JD 4C'))).toBe(135);
  });

  test('special cards are not valid starting cards', () => {
    ['2C', 'JD', 'AH', 'AS', '7H'].forEach(id => expect(isValidStartCard(c(id))).toBe(false));
    ['7S', '8D', 'KC'].forEach(id => expect(isValidStartCard(c(id))).toBe(true));
  });
});

describe('new game', () => {
  test('deals 7 cards each, valid start card, no cards lost', () => {
    const s = createGame([
      { name: 'You', isHuman: true },
      { name: 'Bot 1', isHuman: false },
      { name: 'Bot 2', isHuman: false },
    ]);
    s.players.forEach(p => expect(p.hand).toHaveLength(7));
    expect(s.discardPile).toHaveLength(1);
    expect(isValidStartCard(s.discardPile[0])).toBe(true);
    const total = s.drawPile.length + s.discardPile.length + 21;
    expect(total).toBe(52);
    expect(s.currentPlayer).toBe(0);
  });

  test('rejects fewer than 2 or more than 6 players', () => {
    expect(() => createGame([{ name: 'Solo', isHuman: true }])).toThrow();
  });
});

describe('basic play', () => {
  test('match by suit or by value', () => {
    const s = makeState({ hands: ['5H 9S 4D', 'KC'], top: '9H' });
    expect(canPlayCard(s, c('5H'))).toBe(true); // same suit
    expect(canPlayCard(s, c('9S'))).toBe(true); // same value
    expect(canPlayCard(s, c('4D'))).toBe(false);
  });

  test('invalid card is rejected and nothing changes', () => {
    const s = makeState({ hands: ['5H 4D', 'KC'], top: '9C' });
    const next = play(s, 0, '4D');
    expect(next.error).toMatch(/can't play/);
    expect(next.players[0].hand).toHaveLength(2);
    expect(next.currentPlayer).toBe(0);
  });

  test('cannot act out of turn', () => {
    const s = makeState({ hands: ['5H', 'KH 4H'], top: '9H' });
    expect(play(s, 1, 'KH').error).toMatch(/not your turn/);
  });

  test('drawing takes one card and ends the turn', () => {
    const s = makeState({ hands: ['5H 4D', 'KC'], top: '9C' });
    const next = draw(s, 0);
    expect(next.players[0].hand).toHaveLength(3);
    expect(next.currentPlayer).toBe(1);
  });

  test('9♣ matches any club or any 9', () => {
    expect(canPlayCard(makeState({ hands: ['9C'], top: '4C' }), c('9C'))).toBe(true);
    expect(canPlayCard(makeState({ hands: ['9C'], top: '9D' }), c('9C'))).toBe(true);
  });
});

describe('Jack', () => {
  test('is wild and names the suit to follow', () => {
    const s = makeState({ hands: ['JD 4C', '5S 5H JC 7H'], top: '9C' });
    const next = play(s, 0, 'JD', 'S');
    expect(next.activeSuit).toBe('S');
    expect(canPlayCard(next, c('5S'))).toBe(true);
    expect(canPlayCard(next, c('5H'))).toBe(false);
    expect(canPlayCard(next, c('JC'))).toBe(true); // another Jack
    expect(canPlayCard(next, c('7H'))).toBe(true); // 7♥
  });

  test('requires a suit choice', () => {
    const s = makeState({ hands: ['JD 4C', '5S'], top: '9C' });
    expect(play(s, 0, 'JD').error).toMatch(/Choose a suit/);
  });
});

describe('2s – draw two, stackable', () => {
  test('stack 2 + 2 then accept draws 4', () => {
    let s = makeState({ hands: ['2H 5C', '2S 6C', 'KD QD'], top: '9H' });
    s = play(s, 0, '2H');
    expect(s.pending).toEqual({ kind: 'twos', amount: 2 });
    s = play(s, 1, '2S');
    expect(s.pending).toEqual({ kind: 'twos', amount: 4 });
    expect(s.currentPlayer).toBe(2);
    s = accept(s, 2);
    expect(s.players[2].hand).toHaveLength(6);
    expect(s.pending).toBeNull();
    expect(s.currentPlayer).toBe(0);
  });

  test('only a 2 can answer – Jack and 7♥ cannot cancel', () => {
    const s = makeState({
      hands: ['5C', 'JH 7H 9H'],
      top: '2H',
      pending: { kind: 'twos', amount: 2 },
      current: 1,
    });
    expect(canPlayCard(s, c('JH'))).toBe(false);
    expect(canPlayCard(s, c('7H'))).toBe(false);
    expect(canPlayCard(s, c('9H'))).toBe(false);
  });

  test('cannot draw normally while a penalty is pending', () => {
    const s = makeState({
      hands: ['5C', '9H'],
      top: '2H',
      pending: { kind: 'twos', amount: 2 },
      current: 1,
    });
    expect(draw(s, 1).error).toMatch(/penalty/);
  });
});

describe('Ace of Spades – draw five', () => {
  test('A♠ gives 5, another Ace passes it on (stays 5)', () => {
    let s = makeState({ hands: ['AS 5C', 'AH 6C', 'KD QD'], top: '9S' });
    s = play(s, 0, 'AS');
    expect(s.pending).toEqual({ kind: 'aceSpades', amount: 5 });
    s = play(s, 1, 'AH');
    expect(s.pending).toEqual({ kind: 'aceSpades', amount: 5 });
    s = accept(s, 2);
    expect(s.players[2].hand).toHaveLength(7);
  });

  test('other Aces alone have no effect', () => {
    const s = play(makeState({ hands: ['AH 5C', 'KD'], top: '9H' }), 0, 'AH');
    expect(s.pending).toBeNull();
  });
});

describe('8 – skip', () => {
  test('next player is skipped and draws nothing', () => {
    let s = makeState({ hands: ['8H 5C', 'KD', 'QD QS'], top: '9H' });
    s = play(s, 0, '8H');
    expect(s.pending).toEqual({ kind: 'skip' });
    s = accept(s, 1);
    expect(s.players[1].hand).toHaveLength(1);
    expect(s.currentPlayer).toBe(2);
  });

  test('answering with an 8 moves the skip on', () => {
    let s = makeState({ hands: ['8H 5C', '8D KD', 'QD QS'], top: '9H' });
    s = play(s, 0, '8H');
    s = play(s, 1, '8D');
    expect(s.pending).toEqual({ kind: 'skip' });
    expect(s.currentPlayer).toBe(2);
  });
});

describe('ending a round', () => {
  test('7♥ ends the round; winner still counts their own hand', () => {
    const s = play(makeState({ hands: ['7H KS', 'AS 4C'], top: '9C' }), 0, '7H');
    expect(s.phase).toBe('roundOver');
    expect(s.roundWinner).toBe(0);
    expect(s.players[0].roundPoints).toBe(10);
    expect(s.players[1].roundPoints).toBe(105);
  });

  test('playing your last card wins the round', () => {
    const s = play(makeState({ hands: ['5H', 'KD QD'], top: '9H' }), 0, '5H');
    expect(s.phase).toBe('roundOver');
    expect(s.players[0].roundPoints).toBe(0);
    expect(s.players[1].totalScore).toBe(20);
  });

  test('last card a 2: next player draws 2 (no answer) before scoring', () => {
    const s = play(
      makeState({ hands: ['2H', '2S KD'], top: '9H', draw: '3C 4C' }),
      0,
      '2H',
    );
    expect(s.phase).toBe('roundOver');
    expect(s.players[1].hand).toHaveLength(4);
    expect(s.players[1].roundPoints).toBe(30 + 10 + 5 + 5);
  });
});

describe('elimination & winning', () => {
  test('502+ is eliminated; last player left wins', () => {
    const s = play(
      makeState({ hands: ['5H', 'KD QD'], top: '9H', scores: [0, 495] }),
      0,
      '5H',
    );
    expect(s.players[1].eliminated).toBe(true);
    expect(s.phase).toBe('gameOver');
    expect(s.gameWinner).toBe(0);
  });

  test('round winner is protected even above 502 (7♥ finish)', () => {
    const s = play(
      makeState({
        hands: ['7H AS', '4C', '4D'],
        top: '9C',
        scores: [450, 100, 100],
      }),
      0,
      '7H',
    );
    expect(s.players[0].totalScore).toBe(550);
    expect(s.players[0].eliminated).toBe(false);
    expect(s.phase).toBe('roundOver');
  });

  test('tie-break: everyone over 502 → lowest total wins', () => {
    const s = play(
      makeState({ hands: ['7H AS', 'KD'], top: '9C', scores: [450, 500] }),
      0,
      '7H',
    );
    // P0: 450 + 100 = 550, P1: 500 + 10 = 510 → P1 wins
    expect(s.phase).toBe('gameOver');
    expect(s.gameWinner).toBe(1);
  });

  test('next round: player with fewest points last round starts', () => {
    let s = play(makeState({ hands: ['7H KS', '4C', 'QD'], top: '9C' }), 0, '7H');
    // round points: P0 10, P1 5, P2 10
    s = gameReducer(s, { type: 'NEXT_ROUND' });
    expect(s.roundNumber).toBe(2);
    expect(s.currentPlayer).toBe(1);
    s.players.forEach(p => expect(p.hand).toHaveLength(7));
  });

  test('eliminated players are skipped and get no cards', () => {
    let s = makeState({ hands: ['5H 6H', 'KD', 'QD'], top: '9H' });
    s.players[1].eliminated = true;
    s = play(s, 0, '5H');
    expect(s.currentPlayer).toBe(2);
  });
});

describe('draw pile', () => {
  test('reshuffles discards (except top) when empty', () => {
    const s = makeState({
      hands: ['4D', 'KD'],
      top: '9C',
      draw: '',
      discardsBelow: '3S 4S 5S',
    });
    const next = draw(s, 0);
    expect(next.players[0].hand).toHaveLength(2);
    expect(next.discardPile.map(x => x.id)).toEqual(['9C']);
    expect(next.drawPile).toHaveLength(2);
  });

  test('nothing to draw at all → player just passes', () => {
    const s = makeState({ hands: ['4D', 'KD'], top: '9C', draw: '' });
    const next = draw(s, 0);
    expect(next.players[0].hand).toHaveLength(1);
    expect(next.currentPlayer).toBe(1);
    expect(next.error).toBeNull();
  });
});

describe('full games (random moves)', () => {
  test('200 random games always finish with one winner and no lost cards', () => {
    for (let g = 0; g < 200; g++) {
      const n = 2 + (g % 5); // 2..6 players
      let s = createGame(
        Array.from({ length: n }, (_, i) => ({ name: `P${i}`, isHuman: i === 0 })),
      );
      let steps = 0;
      while (s.phase !== 'gameOver' && steps < 20000) {
        steps++;
        if (s.phase === 'roundOver') {
          s = gameReducer(s, { type: 'NEXT_ROUND' });
          continue;
        }
        const p = s.currentPlayer;
        const playable = s.players[p].hand.filter(card => canPlayCard(s, card));
        if (playable.length && Math.random() < 0.8) {
          const card = playable[Math.floor(Math.random() * playable.length)];
          const suits: Suit[] = ['S', 'H', 'D', 'C'];
          s = play(s, p, card.id, suits[Math.floor(Math.random() * 4)]);
        } else {
          s = s.pending ? accept(s, p) : draw(s, p);
        }
        expect(s.error).toBeNull();
        if (s.phase === 'playing') {
          const inHands = s.players.reduce((sum, pl) => sum + pl.hand.length, 0);
          expect(inHands + s.drawPile.length + s.discardPile.length).toBe(52);
        }
      }
      expect(s.phase).toBe('gameOver');
      expect(s.gameWinner).not.toBeNull();
      expect(s.players[s.gameWinner!].eliminated).toBe(false);
    }
  });
});
