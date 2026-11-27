/**
 * UI tests for the game screen: they render the real screen, press buttons
 * and check what the player sees. Each test starts from a hand-made game
 * situation (createGame is replaced) so every rule/condition can be checked.
 * Run with: npm test
 */
import { act, fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Card, GameState, Pending, Rank, Suit } from '../src/engine';
import * as game from '../src/engine/game';
import GameScreen from '../src/screens/GameScreen';
import HomeScreen from '../src/screens/HomeScreen';
import SetupScreen from '../src/screens/SetupScreen';

jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

// ---------- helpers ----------------------------------------------------------

const c = (id: string): Card => ({
  id,
  rank: id.slice(0, -1) as Rank,
  suit: id.slice(-1) as Suit,
});
const cards = (ids: string) => ids.split(' ').filter(Boolean).map(c);

const NAMES = ['Tester', 'Nova', 'Rex', 'Luna'];

function makeState(opts: {
  hands: string[];
  top: string;
  activeSuit?: Suit;
  pending?: Pending;
  current?: number;
  scores?: number[];
}): GameState {
  return {
    phase: 'playing',
    players: opts.hands.map((h, i) => ({
      name: NAMES[i],
      isHuman: i === 0,
      hand: cards(h),
      totalScore: opts.scores?.[i] ?? 0,
      roundPoints: 0,
      eliminated: false,
    })),
    drawPile: cards('3C 4C 5C 6C 3D 4D 5D 6D 9D 10D 3S 4S'),
    discardPile: [c(opts.top)],
    currentPlayer: opts.current ?? 0,
    activeSuit: opts.activeSuit ?? c(opts.top).suit,
    pending: opts.pending ?? null,
    roundNumber: 1,
    roundWinner: null,
    gameWinner: null,
    eliminatedThisRound: [],
    message: 'Test round',
    error: null,
  };
}

const setups = (n: number) =>
  NAMES.slice(0, n).map((name, i) => ({ name, isHuman: i === 0 }));

let onExit: jest.Mock;

/** Render the game screen starting from `state`. */
async function startAt(state: GameState) {
  jest.spyOn(game, 'createGame').mockReturnValueOnce(state);
  onExit = jest.fn();
  await render(
    <SafeAreaProvider>
      <GameScreen setups={setups(state.players.length)} onExit={onExit} />
    </SafeAreaProvider>,
  );
}

const press = (el: Parameters<typeof fireEvent.press>[0]) =>
  fireEvent.press(el);
/** Let the bots take their turns (they wait 0.9 s each). */
const botsMove = (ms = 1000) => act(() => jest.advanceTimersByTime(ms));

beforeEach(() => jest.useFakeTimers());
afterEach(() => {
  jest.useRealTimers();
  jest.restoreAllMocks();
});

// ---------- basic play -------------------------------------------------------

describe('your turn', () => {
  test('shows your hand with playable cards marked', async () => {
    await startAt(makeState({ hands: ['5H 4D JC', 'KS', 'KD'], top: '9H' }));
    expect(screen.getByText('Your turn')).toBeOnTheScreen();
    expect(screen.getByText('Follow Hearts')).toBeOnTheScreen();
    expect(screen.getByTestId('playable-5H')).toBeOnTheScreen();
    expect(screen.getByTestId('playable-JC')).toBeOnTheScreen(); // Jack = wild
    expect(screen.getByTestId('card-4D')).toBeOnTheScreen(); // not playable
  });

  test('wrong card → error message, nothing changes', async () => {
    await startAt(makeState({ hands: ['5H 4D', 'KS', 'KD'], top: '9H' }));
    await press(screen.getByTestId('card-4D'));
    expect(screen.getByText("You can't play 4♦ right now.")).toBeOnTheScreen();
    expect(screen.getByText('Your turn')).toBeOnTheScreen();
    expect(screen.getByTestId('card-4D')).toBeOnTheScreen();
  });

  test('error message disappears after 2 seconds', async () => {
    await startAt(makeState({ hands: ['5H 4D', 'KS', 'KD'], top: '9H' }));
    await press(screen.getByTestId('card-4D'));
    await act(() => jest.advanceTimersByTime(2100));
    expect(
      screen.queryByText("You can't play 4♦ right now."),
    ).not.toBeOnTheScreen();
  });

  test('valid card is played, then the bots take their turns', async () => {
    await startAt(makeState({ hands: ['5H 4D', 'KS', 'KD'], top: '9H' }));
    await press(screen.getByTestId('playable-5H'));
    expect(screen.getByText('Tester played 5♥.')).toBeOnTheScreen();
    expect(screen.getByText('Nova is thinking…')).toBeOnTheScreen();
    expect(screen.queryByTestId('playable-5H')).not.toBeOnTheScreen();
    await botsMove(); // Nova (K♠ doesn't match 5♥) draws
    expect(screen.getByText('Nova drew a card.')).toBeOnTheScreen();
    await botsMove(); // Rex draws too
    expect(screen.getByText('Your turn')).toBeOnTheScreen();
  });

  test('tapping a card on a bot\'s turn → "It\'s not your turn."', async () => {
    await startAt(
      makeState({ hands: ['5H 4D', 'KS', 'KD'], top: '9H', current: 1 }),
    );
    expect(screen.getByText('Nova is thinking…')).toBeOnTheScreen();
    await press(screen.getByTestId('card-5H'));
    expect(screen.getByText("It's not your turn.")).toBeOnTheScreen();
  });

  test('drawing adds one card and ends your turn', async () => {
    await startAt(makeState({ hands: ['5H 4D', 'KS', 'KD'], top: '9H' }));
    await press(screen.getByText('Draw a card'));
    expect(screen.getByText('Tester drew a card.')).toBeOnTheScreen();
    expect(screen.getByTestId('card-4S')).toBeOnTheScreen(); // top of the draw pile
    expect(screen.getByText('Nova is thinking…')).toBeOnTheScreen();
  });

  test('no playable card → button says "No match – draw a card"', async () => {
    await startAt(makeState({ hands: ['4D 5S', 'KS', 'KD'], top: '9H' }));
    expect(screen.getByText('No match – draw a card')).toBeOnTheScreen();
  });

  test("draw button is disabled during the bots' turns", async () => {
    await startAt(
      makeState({ hands: ['4D', 'KS', 'KD'], top: '9H', current: 1 }),
    );
    expect(screen.getByRole('button', { name: 'Draw a card' })).toBeDisabled();
  });
});

// ---------- special cards -----------------------------------------------------

describe('Jack', () => {
  test('opens the suit picker; Cancel keeps the Jack, a suit plays it', async () => {
    await startAt(makeState({ hands: ['JC 4D', 'KS', 'KD'], top: '9H' }));
    await press(screen.getByTestId('playable-JC'));
    expect(screen.getByText('Jack played – name a suit')).toBeOnTheScreen();

    await press(screen.getByText('Cancel'));
    expect(
      screen.queryByText('Jack played – name a suit'),
    ).not.toBeOnTheScreen();
    expect(screen.getByTestId('playable-JC')).toBeOnTheScreen();

    await press(screen.getByTestId('playable-JC'));
    await press(screen.getByRole('button', { name: 'Spades' }));
    expect(
      screen.getByText('Tester played J♣ and named Spades.'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Jack called Spades')).toBeOnTheScreen();
  });

  test('a Jack as your LAST card is played without asking for a suit', async () => {
    await startAt(makeState({ hands: ['JC', 'KS', 'KD'], top: '9H' }));
    await press(screen.getByTestId('playable-JC'));
    expect(
      screen.queryByText('Jack played – name a suit'),
    ).not.toBeOnTheScreen();
    expect(screen.getByText('You won the round')).toBeOnTheScreen();
  });
});

describe('penalties', () => {
  test('2: banner + "Accept – draw 2"; only a 2 can answer', async () => {
    await startAt(
      makeState({
        hands: ['2S JH 9H', 'KS', 'KD'],
        top: '2H',
        pending: { kind: 'twos', amount: 2 },
      }),
    );
    expect(
      screen.getByText('You: Draw 2 – or stack another 2'),
    ).toBeOnTheScreen();
    expect(screen.getByTestId('playable-2S')).toBeOnTheScreen();
    expect(screen.getByTestId('card-JH')).toBeOnTheScreen(); // Jack can't cancel
    expect(screen.getByTestId('card-9H')).toBeOnTheScreen();

    await press(screen.getByText('Accept – draw 2'));
    expect(screen.getByText('Tester drew 2 penalty cards.')).toBeOnTheScreen();
    expect(screen.getByTestId('card-4S')).toBeOnTheScreen();
    expect(screen.getByTestId('card-3S')).toBeOnTheScreen();
  });

  test('stacking a 2 passes "draw 4" to the next player', async () => {
    await startAt(
      makeState({
        hands: ['2S 9H', 'KS', 'KD'],
        top: '2H',
        pending: { kind: 'twos', amount: 2 },
      }),
    );
    await press(screen.getByTestId('playable-2S'));
    expect(
      screen.getByText('Nova: Draw 4 – or stack another 2'),
    ).toBeOnTheScreen();
    await botsMove();
    expect(screen.getByText('Nova drew 4 penalty cards.')).toBeOnTheScreen();
  });

  test('tapping the draw pile during a penalty is refused', async () => {
    await startAt(
      makeState({
        hands: ['9H', 'KS', 'KD'],
        top: '2H',
        pending: { kind: 'twos', amount: 2 },
      }),
    );
    await press(screen.getByTestId('draw-pile'));
    expect(
      screen.getByText('Answer the penalty or accept it first.'),
    ).toBeOnTheScreen();
  });

  test('A♠: draw 5 or pass it on with another Ace', async () => {
    await startAt(
      makeState({
        hands: ['AH 9S', 'KS', 'KD'],
        top: 'AS',
        pending: { kind: 'aceSpades', amount: 5 },
      }),
    );
    expect(
      screen.getByText('You: Draw 5 – or pass it on with an Ace'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Accept – draw 5')).toBeOnTheScreen();
    await press(screen.getByTestId('playable-AH'));
    expect(
      screen.getByText('Nova: Draw 5 – or pass it on with an Ace'),
    ).toBeOnTheScreen();
  });

  test('8: "Accept skip" loses the turn without drawing', async () => {
    await startAt(
      makeState({
        hands: ['9H 4D', 'KS', 'KD'],
        top: '8H',
        pending: { kind: 'skip' },
      }),
    );
    expect(
      screen.getByText('You: Skipped – or pass it on with an 8'),
    ).toBeOnTheScreen();
    await press(screen.getByText('Accept skip'));
    expect(screen.getByText('Tester was skipped.')).toBeOnTheScreen();
    expect(screen.getByText('Nova is thinking…')).toBeOnTheScreen();
  });

  test('a bot hits you with a 2 → you see the penalty on your turn', async () => {
    await startAt(
      makeState({ hands: ['9C', 'KS', '2H 5D'], top: '9H', current: 2 }),
    );
    await botsMove(); // Rex plays 2♥
    expect(
      screen.getByText('You: Draw 2 – or stack another 2'),
    ).toBeOnTheScreen();
    expect(screen.getByText('Accept – draw 2')).toBeOnTheScreen();
  });
});

// ---------- end of round / game ---------------------------------------------

describe('round and game end', () => {
  test('7♥ ends the round; summary shows scores; Next round deals again', async () => {
    await startAt(makeState({ hands: ['7H KS', 'AS 4C', 'QD'], top: '9C' }));
    await press(screen.getByTestId('playable-7H'));
    expect(screen.getByText('ROUND 1 COMPLETE')).toBeOnTheScreen();
    expect(screen.getByText('You won the round')).toBeOnTheScreen();
    // shown on the table and in the summary
    expect(
      screen.getAllByText('Tester played 7♥ and ended the round!'),
    ).toHaveLength(2);
    expect(screen.getByText('+105')).toBeOnTheScreen(); // Nova: A♠ 100 + 4♣ 5
    // Tester's own K♠ still counts (10) and Rex's Q♦ (10)
    expect(screen.getAllByText('+10')).toHaveLength(2);

    await press(screen.getByText('Next round'));
    expect(screen.getByText('Round 2')).toBeOnTheScreen();
    expect(screen.queryByText('ROUND 1 COMPLETE')).not.toBeOnTheScreen();
  });

  test('last card wins the round; opponent past 502 → "You win!" + replay', async () => {
    await startAt(
      makeState({ hands: ['5H', 'KD QD'], top: '9H', scores: [100, 495] }),
    );
    await press(screen.getByTestId('playable-5H'));
    expect(screen.getByText('You win!')).toBeOnTheScreen();
    expect(
      screen.getByText(
        'Everyone else crossed 502. You are the last one standing.',
      ),
    ).toBeOnTheScreen();
    expect(screen.getByTestId('lottie')).toBeOnTheScreen(); // confetti

    await press(screen.getByText('Play again'));
    expect(screen.queryByText('You win!')).not.toBeOnTheScreen();
    expect(screen.getByText('Round 1')).toBeOnTheScreen();
    expect(screen.getByText('Tester · 0 pts')).toBeOnTheScreen();
  });

  test('a bot wins the game → "Game over" with the winner named', async () => {
    await startAt(
      makeState({
        hands: ['AS KD', '9H'],
        top: '9C',
        current: 1,
        scores: [450, 10],
      }),
    );
    await botsMove(); // Nova plays her last card
    expect(screen.getByText('Game over')).toBeOnTheScreen();
    expect(
      screen.getByText('Nova is the last player under 502.'),
    ).toBeOnTheScreen();
    await press(screen.getByText('Main menu'));
    expect(onExit).toHaveBeenCalled();
  });

  test('you are eliminated but 2 bots remain → "Watch the bots finish"', async () => {
    await startAt(
      makeState({
        hands: ['AS KD', '9H', 'QD QS'],
        top: '9C',
        current: 1,
        scores: [450, 10, 10],
      }),
    );
    await botsMove();
    expect(screen.getByText('Eliminated: Tester')).toBeOnTheScreen();
    expect(screen.getByText('Nova won the round')).toBeOnTheScreen();
    await press(screen.getByText('Watch the bots finish'));
    expect(
      screen.getByText('You are out – watching the bots'),
    ).toBeOnTheScreen();
  });

  test('tie-break: everyone over 502 → lowest total wins', async () => {
    await startAt(
      makeState({ hands: ['7H AS', 'KD'], top: '9C', scores: [450, 500] }),
    );
    await press(screen.getByTestId('playable-7H')); // you 550, Nova 510
    expect(screen.getByText('Game over')).toBeOnTheScreen();
    expect(
      screen.getByText('Nova is the last player under 502.'),
    ).toBeOnTheScreen();
  });
});

// ---------- menus ------------------------------------------------------------

describe('menus', () => {
  test('Scores opens the scoreboard and Close hides it', async () => {
    await startAt(
      makeState({ hands: ['5H', 'KS', 'KD'], top: '9H', scores: [40, 0, 0] }),
    );
    await press(screen.getByText('Scores'));
    expect(screen.getByText('Scoreboard')).toBeOnTheScreen();
    expect(
      screen.getByText('502 points or more = eliminated'),
    ).toBeOnTheScreen();
    await press(screen.getByText('Close'));
    expect(screen.queryByText('Scoreboard')).not.toBeOnTheScreen();
  });

  test('Restart asks first; "Yes, restart" deals a fresh game', async () => {
    const alert = jest.spyOn(Alert, 'alert');
    await startAt(
      makeState({ hands: ['5H', 'KS', 'KD'], top: '9H', scores: [90, 0, 0] }),
    );
    await press(screen.getByText('Restart'));
    expect(alert).toHaveBeenCalledWith(
      'Restart game?',
      expect.any(String),
      expect.any(Array),
    );

    const buttons = alert.mock.calls[0][2]!;
    await act(() => buttons.find(b => b.text === 'Yes, restart')!.onPress!());
    expect(screen.getByText('Tester · 0 pts')).toBeOnTheScreen();
    expect(screen.getByText('Round 1 – first turn: Tester.')).toBeOnTheScreen();
  });

  test('Quit asks first; "Yes, leave" exits to the menu', async () => {
    const alert = jest.spyOn(Alert, 'alert');
    await startAt(makeState({ hands: ['5H', 'KS', 'KD'], top: '9H' }));
    await press(screen.getByText('Quit'));
    const buttons = alert.mock.calls[0][2]!;
    expect(buttons.map(b => b.text)).toEqual(['Stay', 'Yes, leave']);
    buttons.find(b => b.text === 'Yes, leave')!.onPress!();
    expect(onExit).toHaveBeenCalled();
  });
});

// ---------- other screens -------------------------------------------------------

describe('home and setup', () => {
  test('PLAY opens setup', async () => {
    const onPlay = jest.fn();
    await render(<HomeScreen onPlay={onPlay} />);
    await press(screen.getByText('PLAY'));
    expect(onPlay).toHaveBeenCalled();
  });

  test('blank name becomes "You"; chosen number of bots is used', async () => {
    const onStart = jest.fn();
    await render(<SetupScreen onStart={onStart} onBack={jest.fn()} />);
    await fireEvent.changeText(screen.getByTestId('name-input'), '   ');
    await press(screen.getByText('5'));
    expect(screen.getByText('6 players · 7 cards each')).toBeOnTheScreen();
    await press(screen.getByText('Deal cards'));
    expect(onStart).toHaveBeenCalledWith([
      { name: 'You', isHuman: true },
      { name: 'Nova', isHuman: false },
      { name: 'Rex', isHuman: false },
      { name: 'Luna', isHuman: false },
      { name: 'Milo', isHuman: false },
      { name: 'Zara', isHuman: false },
    ]);
  });

  test('name is trimmed', async () => {
    const onStart = jest.fn();
    await render(<SetupScreen onStart={onStart} onBack={jest.fn()} />);
    await fireEvent.changeText(screen.getByTestId('name-input'), '  Norman  ');
    await press(screen.getByText('Deal cards'));
    expect(onStart.mock.calls[0][0][0]).toEqual({
      name: 'Norman',
      isHuman: true,
    });
  });
});
