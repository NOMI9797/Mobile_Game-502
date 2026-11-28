/**
 * Full-game playthrough test.
 *
 * Plays complete games of 502 (You + 2 bots) through the real gameReducer.
 * "You" is moved by the same AI as the bots so the game runs on its own.
 * After EVERY action the result is checked against an independent copy of
 * the rules written below (not the engine's own helpers):
 *   - the card played was legal, the turn passed to the right player,
 *   - each special card had the right effect (2 / A♠ / 8 / Jack / 7♥),
 *   - penalties drew the right number of cards, skips drew none,
 *   - all 52 cards are always accounted for, no duplicates,
 *   - round scoring, elimination at 502 and the game winner are correct,
 *   - illegal moves (wrong card, wrong turn, draw during a penalty,
 *     Jack without a suit, accept with no penalty) are rejected and
 *     leave the game unchanged.
 *
 * Normal `npm test` plays 20 seeded games and only checks.
 * `FULL_GAME_REPORT=1 npx jest fullGameReport` also picks a seed whose game
 * shows every special case and writes a turn-by-turn log to
 * docs/test-report/full-game-log.md
 */
import {
  Card,
  GameAction,
  GameState,
  Suit,
  chooseAiAction,
  createGame,
  gameReducer,
} from '../src/engine';

// Node globals (this RN project has no @types/node; Jest runs in Node).
declare const process: { env: Record<string, string | undefined> };
declare const __dirname: string;
declare function require(name: string): any;
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// Independent rule oracle
// ---------------------------------------------------------------------------
const SYM: Record<Suit, string> = { S: '♠', H: '♥', D: '♦', C: '♣' };
const SUIT_WORD: Record<Suit, string> = {
  S: 'Spades',
  H: 'Hearts',
  D: 'Diamonds',
  C: 'Clubs',
};
const label = (c: Card) => c.rank + SYM[c.suit];
const is7H = (c: Card) => c.rank === '7' && c.suit === 'H';
const isAS = (c: Card) => c.rank === 'A' && c.suit === 'S';

function points(c: Card): number {
  if (is7H(c) || isAS(c)) return 100;
  if (c.rank === '2' || c.rank === '8' || c.rank === 'J') return 30;
  if (c.rank === 'A') return 20;
  if (c.rank === '10' || c.rank === 'Q' || c.rank === 'K') return 10;
  return 5;
}

function legal(s: GameState, c: Card): boolean {
  const p = s.pending;
  if (p?.kind === 'twos') return c.rank === '2';
  if (p?.kind === 'aceSpades') return c.rank === 'A';
  if (p?.kind === 'skip') return c.rank === '8';
  if (c.rank === 'J' || is7H(c)) return true;
  const top = s.discardPile[s.discardPile.length - 1];
  return c.suit === s.activeSuit || c.rank === top.rank;
}

function nextActive(s: GameState, from: number): number {
  const n = s.players.length;
  for (let k = 1; k <= n; k++) {
    const i = (from + k) % n;
    if (!s.players[i].eliminated) return i;
  }
  return from;
}

function allCards(s: GameState): string[] {
  return [
    ...s.drawPile,
    ...s.discardPile,
    ...s.players.flatMap(p => p.hand),
  ].map(c => c.id);
}

// ---------------------------------------------------------------------------
// Seeded randomness so a game can be replayed exactly
// ---------------------------------------------------------------------------
/* eslint-disable no-bitwise */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/* eslint-enable no-bitwise */

// ---------------------------------------------------------------------------
// Playing one recorded game
// ---------------------------------------------------------------------------
type Feature =
  | 'two'
  | 'twoStacked'
  | 'aceSpades'
  | 'acePassed'
  | 'eight'
  | 'eightPassed'
  | 'jack'
  | 'sevenHearts'
  | 'acceptDraw'
  | 'skipped'
  | 'normalDraw'
  | 'lastCardPenalty'
  | 'reshuffle'
  | 'elimination'
  | 'gameOver';

interface Result {
  seed: number;
  lines: string[];
  features: Set<Feature>;
  checks: number;
  rejected: Record<string, number>;
  violations: string[];
  rounds: number;
  turns: number;
  winner: string;
}

const PLAYERS = [
  { name: 'You', isHuman: true },
  { name: 'Nova', isHuman: false },
  { name: 'Rex', isHuman: false },
];

function playGame(seed: number): Result {
  const rnd = mulberry32(seed);
  const spy = jest.spyOn(Math, 'random').mockImplementation(rnd);
  const lines: string[] = [];
  const features = new Set<Feature>();
  const violations: string[] = [];
  const rejected: Record<string, number> = {};
  let checks = 0;
  let turns = 0;
  const check = (ok: boolean, what: string) => {
    checks++;
    if (!ok) violations.push(`Turn ${turns}: ${what}`);
    return ok;
  };
  const expectRejected = (s: GameState, a: GameAction, kind: string) => {
    const after = gameReducer(s, a);
    const unchanged =
      JSON.stringify({ ...after, error: null }) ===
      JSON.stringify({ ...s, error: null });
    if (check(!!after.error && unchanged, `${kind} was not rejected`)) {
      rejected[kind] = (rejected[kind] ?? 0) + 1;
    }
  };

  let s = createGame(PLAYERS);
  let guard = 0;

  const roundHeader = () => {
    const start = s.discardPile[0];
    lines.push(`\n## Round ${s.roundNumber}\n`);
    lines.push(
      `Starting card: **${label(start)}** · first turn: **${
        s.players[s.currentPlayer].name
      }**\n`,
    );
    lines.push('Hands dealt (7 cards each):\n');
    s.players.forEach(p => {
      if (!p.eliminated)
        lines.push(`- ${p.name}: ${p.hand.map(label).join(' ')}`);
    });
    lines.push(
      '\n| # | Player | Action | Effect | Cards left | Check |\n|---|---|---|---|---|---|',
    );
    check(
      s.players.every(p => p.eliminated || p.hand.length === 7),
      'not everyone got 7 cards',
    );
    check(
      !(
        start.rank === '2' ||
        start.rank === 'J' ||
        start.rank === 'A' ||
        is7H(start)
      ),
      `illegal starting card ${label(start)}`,
    );
  };
  roundHeader();

  while (s.phase !== 'gameOver' && guard++ < 20000) {
    if (s.phase === 'roundOver') {
      s = gameReducer(s, { type: 'NEXT_ROUND' });
      roundHeader();
      continue;
    }

    turns++;
    const me = s.currentPlayer;
    const player = s.players[me];
    const before = s;

    // --- Illegal moves must be rejected without changing anything ---------
    const other = nextActive(s, me);
    expectRejected(
      s,
      { type: 'DRAW_CARD', playerIndex: other },
      'Out-of-turn move',
    );
    const bad = player.hand.find(c => !legal(s, c));
    if (bad)
      expectRejected(
        s,
        { type: 'PLAY_CARD', playerIndex: me, cardId: bad.id },
        'Illegal card',
      );
    if (s.pending)
      expectRejected(
        s,
        { type: 'DRAW_CARD', playerIndex: me },
        'Draw during a penalty',
      );
    else
      expectRejected(
        s,
        { type: 'ACCEPT_PENALTY', playerIndex: me },
        'Accept with no penalty',
      );
    const jack = player.hand.find(c => c.rank === 'J' && legal(s, c));
    if (jack && player.hand.length > 1)
      expectRejected(
        s,
        { type: 'PLAY_CARD', playerIndex: me, cardId: jack.id },
        'Jack without a suit',
      );

    // --- The real move ----------------------------------------------------
    const action = chooseAiAction(s, me);
    s = gameReducer(s, action);
    check(!s.error, `engine rejected AI move: ${s.error}`);
    check(
      new Set(allCards(s)).size === 52 && allCards(s).length === 52,
      'cards lost or duplicated',
    );

    let act = '';
    let effect = '';
    const turnOf = (i: number) =>
      s.players[i].isHuman ? 'your turn' : `${s.players[i].name}'s turn`;
    const roundEnded = s.phase !== 'playing';

    if (action.type === 'PLAY_CARD') {
      const card = before.players[me].hand.find(c => c.id === action.cardId)!;
      check(legal(before, card), `${label(card)} was not a legal play`);
      check(
        s.players[me].hand.length === before.players[me].hand.length - 1 ||
          (is7H(card) &&
            s.players[me].hand.length === before.players[me].hand.length - 1),
        'hand size wrong after playing',
      );
      act = `played **${label(card)}**`;
      const prevP = before.pending;

      if (is7H(card)) {
        features.add('sevenHearts');
        effect = '7♥ wild – round ends immediately, player wins the round';
        check(roundEnded && s.roundWinner === me, '7♥ did not end the round');
      } else {
        const lastCard = before.players[me].hand.length === 1;
        // Expected suit to follow
        if (card.rank === 'J') {
          features.add('jack');
          if (action.chosenSuit) {
            act += ` and named **${SUIT_WORD[action.chosenSuit]}**`;
            effect = `Jack wild – suit to follow is now ${
              SUIT_WORD[action.chosenSuit]
            }`;
            if (!roundEnded)
              check(
                s.activeSuit === action.chosenSuit,
                'Jack suit not applied',
              );
          } else effect = 'Jack as last card (no suit needed)';
        } else if (!roundEnded) {
          check(s.activeSuit === card.suit, 'suit to follow not updated');
        }
        // Expected pending
        let expPending: GameState['pending'] = null;
        if (card.rank === '2') {
          const amt = (prevP?.kind === 'twos' ? prevP.amount : 0) + 2;
          expPending = { kind: 'twos', amount: amt };
          features.add(prevP?.kind === 'twos' ? 'twoStacked' : 'two');
          effect =
            prevP?.kind === 'twos'
              ? `2 stacked – penalty grows from ${prevP.amount} to ${amt} cards`
              : 'Next player must draw 2 or stack another 2';
        } else if (
          isAS(card) ||
          (card.rank === 'A' && prevP?.kind === 'aceSpades')
        ) {
          expPending = { kind: 'aceSpades', amount: 5 };
          if (prevP?.kind === 'aceSpades') {
            features.add('acePassed');
            effect =
              'Ace passes the A♠ penalty on – next player must draw 5 or pass it with an Ace';
          } else {
            features.add('aceSpades');
            effect = 'A♠ – next player must draw 5 or pass it with an Ace';
          }
        } else if (card.rank === '8') {
          expPending = { kind: 'skip' };
          features.add(prevP?.kind === 'skip' ? 'eightPassed' : 'eight');
          effect =
            prevP?.kind === 'skip'
              ? '8 passes the skip on – next player is skipped unless they play an 8'
              : 'Next player is skipped unless they play an 8';
        } else if (card.rank === 'A') {
          effect = effect || 'Normal Ace (no penalty)';
        }
        if (!effect) effect = 'Normal card';

        if (lastCard) {
          check(
            roundEnded && s.roundWinner === me,
            'last card did not end round',
          );
          effect += ' · **last card – out of cards, wins the round**';
          if (expPending && expPending.kind !== 'skip') {
            const victim = nextActive(before, me);
            const got =
              s.players[victim].hand.length -
              before.players[victim].hand.length;
            const avail = before.drawPile.length + before.discardPile.length; // upper bound
            check(
              got === Math.min(expPending.amount, avail),
              `last-card penalty: ${before.players[victim].name} drew ${got}, expected ${expPending.amount}`,
            );
            features.add('lastCardPenalty');
            effect += ` · ${before.players[victim].name} still draws ${got}`;
          }
        } else {
          check(
            JSON.stringify(s.pending) === JSON.stringify(expPending),
            `pending was ${JSON.stringify(
              s.pending,
            )}, expected ${JSON.stringify(expPending)}`,
          );
          check(
            s.currentPlayer === nextActive(before, me),
            'turn did not pass to next player',
          );
          effect += ` → ${turnOf(s.currentPlayer)}`;
        }
      }
    } else if (action.type === 'DRAW_CARD') {
      features.add('normalDraw');
      check(!before.pending, 'drew during a penalty');
      const got = s.players[me].hand.length - before.players[me].hand.length;
      check(
        got === 1 || before.drawPile.length + before.discardPile.length <= 1,
        'draw did not give 1 card',
      );
      if (before.drawPile.length === 0) features.add('reshuffle');
      act = 'drew a card';
      effect = `No playable card – drew ${got}${
        before.drawPile.length === 0
          ? ' (discard pile reshuffled into a new draw pile)'
          : ''
      }, turn ends → ${turnOf(s.currentPlayer)}`;
      check(
        s.currentPlayer === nextActive(before, me),
        'turn did not pass after draw',
      );
    } else if (action.type === 'ACCEPT_PENALTY') {
      const p = before.pending!;
      const got = s.players[me].hand.length - before.players[me].hand.length;
      if (p.kind === 'skip') {
        features.add('skipped');
        act = 'accepted the skip';
        effect = `Skipped – loses the turn, draws nothing → ${turnOf(
          s.currentPlayer,
        )}`;
        check(got === 0, 'skip drew cards');
      } else {
        features.add('acceptDraw');
        if (before.drawPile.length < p.amount) features.add('reshuffle');
        act = `accepted the penalty`;
        effect = `Drew **${got}** penalty cards (${
          p.kind === 'twos' ? (p.amount > 2 ? 'stacked 2s' : 'a 2') : 'A♠'
        }) → ${turnOf(s.currentPlayer)}`;
        const avail = before.drawPile.length + before.discardPile.length - 1;
        check(
          got === Math.min(p.amount, avail),
          `penalty drew ${got}, expected ${p.amount}`,
        );
      }
      check(s.pending === null, 'penalty not cleared');
      check(
        s.currentPlayer === nextActive(before, me),
        'turn did not pass after penalty',
      );
    }

    lines.push(
      `| ${turns} | ${player.name} | ${act} | ${effect} | ${
        s.players[me].hand.length
      } | ${violations.length ? '❌' : '✅'} |`,
    );

    // --- Round end: scoring and elimination ------------------------------
    if (roundEnded) {
      const w = s.roundWinner!;
      lines.push(
        `\n**Round ${s.roundNumber} won by ${s.players[w].name}.** Cards left in hand count as penalty points:\n`,
      );
      lines.push(
        '| Player | Cards left | Round points | Total | Status |\n|---|---|---|---|---|',
      );
      const active = before.players
        .map((_, i) => i)
        .filter(i => !before.players[i].eliminated);
      const totals = new Map<number, number>();
      for (const i of active) {
        const pts = s.players[i].hand.reduce((a, c) => a + points(c), 0);
        check(
          s.players[i].roundPoints === pts,
          `${s.players[i].name} round points ${s.players[i].roundPoints}, expected ${pts}`,
        );
        const tot = before.players[i].totalScore + pts;
        totals.set(i, tot);
        check(
          s.players[i].totalScore === tot,
          `${s.players[i].name} total wrong`,
        );
      }
      // elimination oracle
      const allOver = active.every(i => totals.get(i)! >= 502);
      let expectOut: number[];
      if (allOver) {
        const best = active.reduce(
          (b, i) => (totals.get(i)! < totals.get(b)! ? i : b),
          active[0],
        );
        expectOut = active.filter(i => i !== best);
      } else {
        expectOut = active.filter(i => i !== w && totals.get(i)! >= 502);
      }
      check(
        JSON.stringify([...s.eliminatedThisRound].sort()) ===
          JSON.stringify(expectOut.sort()),
        `eliminated ${s.eliminatedThisRound}, expected ${expectOut}`,
      );
      if (expectOut.length) features.add('elimination');
      for (const i of active) {
        const p = s.players[i];
        const status = p.eliminated
          ? '❌ eliminated (502+)'
          : i === w
          ? '🏆 round winner'
          : 'still in';
        lines.push(
          `| ${p.name} | ${p.hand.map(label).join(' ') || '–'} | ${
            p.roundPoints
          } | ${p.totalScore} | ${status} |`,
        );
      }
      const left = active.filter(i => !s.players[i].eliminated);
      if (left.length === 1) {
        check(
          s.phase === 'gameOver' && s.gameWinner === left[0],
          'game should be over',
        );
      } else {
        check(s.phase === 'roundOver', 'round should be over, game continues');
      }
    }
  }
  spy.mockRestore();

  check(s.phase === 'gameOver', 'game never finished');
  features.add('gameOver');
  const winner = s.gameWinner != null ? s.players[s.gameWinner].name : '?';
  lines.push(
    `\n## 🏆 Game over – ${winner === 'You' ? 'You win' : `${winner} wins`}\n`,
  );
  lines.push('| Player | Final total | Result |\n|---|---|---|');
  s.players.forEach((p, i) =>
    lines.push(
      `| ${p.name} | ${p.totalScore} | ${
        i === s.gameWinner ? 'WINNER' : 'eliminated'
      } |`,
    ),
  );
  // "Play again" = NEW_GAME with the same players
  const again = gameReducer(s, { type: 'NEW_GAME', players: PLAYERS });
  check(
    again.phase === 'playing' &&
      again.roundNumber === 1 &&
      again.players.every(
        p => p.totalScore === 0 && !p.eliminated && p.hand.length === 7,
      ),
    'Play again did not reset the game',
  );
  lines.push(
    `\n**Play again** → new game started: Round 1, all scores 0, everyone dealt 7 cards ✅`,
  );

  return {
    seed,
    lines,
    features,
    checks,
    rejected,
    violations,
    rounds: s.roundNumber,
    turns,
    winner,
  };
}

const ALL_FEATURES: Feature[] = [
  'two',
  'twoStacked',
  'aceSpades',
  'acePassed',
  'eight',
  'eightPassed',
  'jack',
  'sevenHearts',
  'acceptDraw',
  'skipped',
  'normalDraw',
  'lastCardPenalty',
  'reshuffle',
  'elimination',
  'gameOver',
];

const FEATURE_TEXT: Record<Feature, string> = {
  two: '2 played – next player draws 2',
  twoStacked: '2s stacked (penalty grows by 2 each time)',
  aceSpades: 'A♠ played – next player draws 5',
  acePassed: 'A♠ penalty passed on with another Ace',
  eight: '8 played – next player skipped',
  eightPassed: 'Skip passed on with another 8',
  jack: 'Jack played and a new suit named',
  sevenHearts: '7♥ played – round ends instantly',
  acceptDraw: 'Penalty accepted (cards drawn)',
  skipped: 'Skip accepted (turn lost, no cards)',
  normalDraw: 'No playable card – drew 1',
  lastCardPenalty: 'Won with a 2/A♠ as last card – next player still draws',
  reshuffle: 'Draw pile ran out – discard pile reshuffled',
  elimination: 'Player eliminated at 502+',
  gameOver: 'Game over, winner shown, Play again resets',
};

describe('full game playthrough', () => {
  it('20 complete seeded games follow every rule', () => {
    for (let seed = 1; seed <= 20; seed++) {
      const r = playGame(seed);
      expect(r.violations).toEqual([]);
    }
  });

  if (process.env.FULL_GAME_REPORT) {
    it('writes a turn-by-turn report of a game that shows every special case', () => {
      let chosen: Result | null = null;
      let fallback: Result | null = null;
      for (let seed = 1; seed <= 400 && !chosen; seed++) {
        const r = playGame(seed);
        expect(r.violations).toEqual([]);
        const missing = ALL_FEATURES.filter(f => !r.features.has(f)).length;
        if (missing === 0 && r.turns < 450) chosen = r;
        else if (
          !fallback ||
          missing < ALL_FEATURES.filter(f => !fallback!.features.has(f)).length
        )
          fallback = r;
      }
      const r = chosen ?? fallback!;
      const covered = ALL_FEATURES.map(
        f => `- ${r.features.has(f) ? '✅' : '⬜'} ${FEATURE_TEXT[f]}`,
      ).join('\n');
      const rej = Object.entries(r.rejected)
        .map(([k, n]) => `- ${k}: rejected correctly ${n} times`)
        .join('\n');
      const header = [
        '# 502 – full game test log',
        '',
        `Seed ${r.seed} · players: You, Nova, Rex · ${r.rounds} rounds · ${r.turns} turns · winner: **${r.winner}**`,
        '',
        `Automated rule checks passed: **${r.checks}** · failures: **${r.violations.length}**`,
        '',
        'Special cases seen in this game:',
        covered,
        '',
        'Illegal moves tried on every turn (all must be refused, game unchanged):',
        rej,
      ].join('\n');
      const out = path.join(
        __dirname,
        '..',
        'docs',
        'test-report',
        'full-game-log.md',
      );
      fs.mkdirSync(path.dirname(out), { recursive: true });
      fs.writeFileSync(out, header + '\n' + r.lines.join('\n') + '\n');
      console.log(
        JSON.stringify({
          seed: r.seed,
          rounds: r.rounds,
          turns: r.turns,
          winner: r.winner,
          checks: r.checks,
          violations: r.violations.length,
          missing: ALL_FEATURES.filter(f => !r.features.has(f)),
          rejected: r.rejected,
        }),
      );
    });
  }
});
