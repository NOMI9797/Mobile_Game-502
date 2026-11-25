/**
 * game.ts
 * The 502 game engine: starting games/rounds and the reducer that applies
 * every player action. React calls `gameReducer` through `useReducer`.
 *
 * Every exported function returns a NEW state object; the state passed in is
 * never changed. Internally we work on a fresh copy (`cloneState`).
 */
import {
  SUIT_NAME,
  cardLabel,
  createDeck,
  handPoints,
  isAceOfSpades,
  isSevenOfHearts,
  isValidStartCard,
  shuffle,
} from './deck';
import { canPlayCard } from './rules';
import { GameAction, GameState, Player, PlayerSetup } from './types';

export const ELIMINATION_SCORE = 502;
export const CARDS_PER_PLAYER = 7;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 6;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Copy the state deeply enough that we can safely modify the copy. */
export function cloneState(state: GameState): GameState {
  return {
    ...state,
    players: state.players.map(p => ({ ...p, hand: [...p.hand] })),
    drawPile: [...state.drawPile],
    discardPile: [...state.discardPile],
    eliminatedThisRound: [...state.eliminatedThisRound],
  };
}

/** Keep the state but report an invalid action (the UI shows `error`). */
function withError(state: GameState, error: string): GameState {
  return { ...state, error };
}

/** Next player clockwise who is still in the game. Play direction never reverses. */
export function nextActivePlayer(players: Player[], from: number): number {
  for (let step = 1; step <= players.length; step++) {
    const index = (from + step) % players.length;
    if (!players[index].eliminated) return index;
  }
  return from;
}

/**
 * When the draw pile is empty, every discard except the top card is shuffled
 * into a new draw pile.
 */
function refillDrawPile(state: GameState): void {
  if (state.discardPile.length <= 1) return;
  const top = state.discardPile[state.discardPile.length - 1];
  state.drawPile = shuffle(state.discardPile.slice(0, -1));
  state.discardPile = [top];
}

/** Move up to `count` cards from the draw pile into a hand. Returns how many were drawn. */
function drawInto(
  state: GameState,
  playerIndex: number,
  count: number,
): number {
  let drawn = 0;
  for (let i = 0; i < count; i++) {
    if (state.drawPile.length === 0) refillDrawPile(state);
    const card = state.drawPile.pop();
    if (!card) break; // every card is in someone's hand – nothing left to draw
    state.players[playerIndex].hand.push(card);
    drawn++;
  }
  return drawn;
}

/** Appended to the message so the next player knows what they face. */
function pendingSuffix(state: GameState): string {
  const next = state.players[state.currentPlayer].name;
  const pending = state.pending;
  if (!pending) return '';
  if (pending.kind === 'twos')
    return ` ${next} must draw ${pending.amount} or stack a 2.`;
  if (pending.kind === 'aceSpades')
    return ` ${next} must draw 5 or pass it with an Ace.`;
  return ` ${next} is skipped unless they play an 8.`;
}

// ---------------------------------------------------------------------------
// Starting a game / round
// ---------------------------------------------------------------------------

export function createGame(setups: PlayerSetup[]): GameState {
  if (setups.length < MIN_PLAYERS || setups.length > MAX_PLAYERS) {
    throw new Error(`502 needs ${MIN_PLAYERS}–${MAX_PLAYERS} players.`);
  }
  const empty: GameState = {
    phase: 'playing',
    players: setups.map(s => ({
      name: s.name,
      isHuman: s.isHuman,
      hand: [],
      totalScore: 0,
      roundPoints: 0,
      eliminated: false,
    })),
    drawPile: [],
    discardPile: [],
    currentPlayer: 0,
    activeSuit: 'S',
    pending: null,
    roundNumber: 0,
    roundWinner: null,
    gameWinner: null,
    eliminatedThisRound: [],
    message: '',
    error: null,
  };
  return startRound(empty);
}

/**
 * Who starts: in round one the first seat (the human). Afterwards, the player
 * with the fewest points last round (ties → earliest seat).
 */
function chooseFirstPlayer(state: GameState): number {
  const active = state.players
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => !p.eliminated);
  if (state.roundNumber === 1) return active[0].i;
  let best = active[0];
  for (const entry of active) {
    if (entry.p.roundPoints < best.p.roundPoints) best = entry;
  }
  return best.i;
}

export function startRound(previous: GameState): GameState {
  const state = cloneState(previous);
  state.roundNumber += 1;

  // Fresh shuffled deck, 7 cards to every player still in the game.
  let deck = shuffle(createDeck());
  state.players.forEach(p => (p.hand = []));
  for (let i = 0; i < CARDS_PER_PLAYER; i++) {
    state.players.forEach(p => {
      if (!p.eliminated) p.hand.push(deck.pop()!);
    });
  }

  // Flip the starting card; a 2, Jack, Ace or 7♥ is put back and we flip again.
  let start = deck.pop()!;
  while (!isValidStartCard(start)) {
    deck = shuffle([...deck, start]);
    start = deck.pop()!;
  }

  state.drawPile = deck;
  state.discardPile = [start];
  state.activeSuit = start.suit;
  state.pending = null;
  state.currentPlayer = chooseFirstPlayer(state);
  state.players.forEach(p => (p.roundPoints = 0));
  state.phase = 'playing';
  state.roundWinner = null;
  state.eliminatedThisRound = [];
  state.error = null;
  state.message = `Round ${state.roundNumber}: ${
    state.players[state.currentPlayer].name
  } goes first.`;
  return state;
}

// ---------------------------------------------------------------------------
// Ending a round: scoring and elimination
// ---------------------------------------------------------------------------

function endRound(state: GameState, winner: number): GameState {
  state.roundWinner = winner;
  state.pending = null;

  const active = state.players
    .map((_, i) => i)
    .filter(i => !state.players[i].eliminated);

  // Every card left in hand counts against its owner (the winner too – a 7♥
  // finish can leave cards in the winner's hand).
  for (const i of active) {
    const p = state.players[i];
    p.roundPoints = handPoints(p.hand);
    p.totalScore += p.roundPoints;
  }

  const over = (i: number) => state.players[i].totalScore >= ELIMINATION_SCORE;

  // Tie-break: if ALL remaining players reach 502 in the same round,
  // the one with the lowest total wins.
  if (active.every(over)) {
    let best = active[0];
    for (const i of active) {
      if (state.players[i].totalScore < state.players[best].totalScore)
        best = i;
    }
    for (const i of active) {
      if (i !== best) {
        state.players[i].eliminated = true;
        state.eliminatedThisRound.push(i);
      }
    }
    state.gameWinner = best;
    state.phase = 'gameOver';
    return state;
  }

  // Normal case: 502+ is out, but the round winner is protected this round.
  for (const i of active) {
    if (i !== winner && over(i)) {
      state.players[i].eliminated = true;
      state.eliminatedThisRound.push(i);
    }
  }

  const remaining = active.filter(i => !state.players[i].eliminated);
  if (remaining.length === 1) {
    state.gameWinner = remaining[0];
    state.phase = 'gameOver';
  } else {
    state.phase = 'roundOver';
  }
  return state;
}

// ---------------------------------------------------------------------------
// Player actions
// ---------------------------------------------------------------------------

/** Shared checks for PLAY / DRAW / ACCEPT. Returns an error text or null. */
function turnError(state: GameState, playerIndex: number): string | null {
  if (state.phase !== 'playing') return 'The round is not in progress.';
  if (playerIndex !== state.currentPlayer) return "It's not your turn.";
  return null;
}

function playCard(
  previous: GameState,
  action: Extract<GameAction, { type: 'PLAY_CARD' }>,
): GameState {
  const problem = turnError(previous, action.playerIndex);
  if (problem) return withError(previous, problem);

  const card = previous.players[action.playerIndex].hand.find(
    c => c.id === action.cardId,
  );
  if (!card) return withError(previous, 'That card is not in your hand.');
  if (!canPlayCard(previous, card)) {
    return withError(previous, `You can't play ${cardLabel(card)} right now.`);
  }
  const isLastCard = previous.players[action.playerIndex].hand.length === 1;
  if (card.rank === 'J' && !isLastCard && !action.chosenSuit) {
    return withError(previous, 'Choose a suit for your Jack.');
  }

  const state = cloneState(previous);
  state.error = null;
  const me = action.playerIndex;
  const player = state.players[me];
  player.hand = player.hand.filter(c => c.id !== card.id);
  state.discardPile.push(card);
  let message = `${player.name} played ${cardLabel(card)}.`;

  // 7♥: the round ends immediately and the player who played it wins.
  if (isSevenOfHearts(card)) {
    state.message = `${player.name} played 7♥ and ended the round!`;
    return endRound(state, me);
  }

  // Suit to follow from now on.
  if (card.rank === 'J' && action.chosenSuit) {
    state.activeSuit = action.chosenSuit;
    message = `${player.name} played ${cardLabel(card)} and named ${
      SUIT_NAME[action.chosenSuit]
    }.`;
  } else {
    state.activeSuit = card.suit;
  }

  // Special-card effects.
  const wasPending = state.pending;
  if (card.rank === '2') {
    // 2s stack: 2, 4, 6, 8 …
    const sofar = wasPending?.kind === 'twos' ? wasPending.amount : 0;
    state.pending = { kind: 'twos', amount: sofar + 2 };
  } else if (
    isAceOfSpades(card) ||
    (card.rank === 'A' && wasPending?.kind === 'aceSpades')
  ) {
    // A♠ = draw 5. Another Ace passes it on; it stays at 5.
    state.pending = { kind: 'aceSpades', amount: 5 };
  } else if (card.rank === '8') {
    state.pending = { kind: 'skip' };
  } else {
    state.pending = null;
  }

  // Played the last card → round over. A 2 or A♠ penalty is still drawn
  // by the next player (who can't answer it) before scoring.
  if (player.hand.length === 0) {
    if (state.pending && state.pending.kind !== 'skip') {
      const victim = nextActivePlayer(state.players, me);
      const drawn = drawInto(state, victim, state.pending.amount);
      message += ` ${state.players[victim].name} draws ${drawn}.`;
    }
    state.message = `${message} ${player.name} is out of cards!`;
    return endRound(state, me);
  }

  state.currentPlayer = nextActivePlayer(state.players, me);
  state.message = message + pendingSuffix(state);
  return state;
}

function drawCard(previous: GameState, playerIndex: number): GameState {
  const problem = turnError(previous, playerIndex);
  if (problem) return withError(previous, problem);
  if (previous.pending) {
    return withError(previous, 'Answer the penalty or accept it first.');
  }

  const state = cloneState(previous);
  state.error = null;
  const name = state.players[playerIndex].name;
  const drawn = drawInto(state, playerIndex, 1);
  // A drawn card can't be played this turn, so drawing ends the turn.
  state.message = drawn
    ? `${name} drew a card.`
    : `No cards left to draw – ${name} passes.`;
  state.currentPlayer = nextActivePlayer(state.players, playerIndex);
  return state;
}

function acceptPenalty(previous: GameState, playerIndex: number): GameState {
  const problem = turnError(previous, playerIndex);
  if (problem) return withError(previous, problem);
  if (!previous.pending)
    return withError(previous, 'There is no penalty to accept.');

  const state = cloneState(previous);
  state.error = null;
  const name = state.players[playerIndex].name;
  const pending = state.pending!;
  if (pending.kind === 'skip') {
    // Skipped: lose the turn, no cards drawn.
    state.message = `${name} was skipped.`;
  } else {
    const drawn = drawInto(state, playerIndex, pending.amount);
    state.message = `${name} drew ${drawn} penalty cards.`;
  }
  state.pending = null;
  state.currentPlayer = nextActivePlayer(state.players, playerIndex);
  return state;
}

// ---------------------------------------------------------------------------
// Reducer
// ---------------------------------------------------------------------------

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'PLAY_CARD':
      return playCard(state, action);
    case 'DRAW_CARD':
      return drawCard(state, action.playerIndex);
    case 'ACCEPT_PENALTY':
      return acceptPenalty(state, action.playerIndex);
    case 'NEXT_ROUND':
      if (state.phase !== 'roundOver')
        return withError(state, 'The round is not over yet.');
      return startRound(state);
    case 'NEW_GAME':
      return createGame(action.players);
    default:
      return state;
  }
}
