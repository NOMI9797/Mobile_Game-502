/**
 * types.ts
 * All the data shapes used by the 502 game engine.
 * The engine is plain TypeScript (no React) so it can be tested on its own.
 */

/** S = Spades, H = Hearts, D = Diamonds, C = Clubs */
export type Suit = 'S' | 'H' | 'D' | 'C';

export type Rank =
  | 'A'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'
  | '7'
  | '8'
  | '9'
  | '10'
  | 'J'
  | 'Q'
  | 'K';

export interface Card {
  /** Unique id, e.g. "7H" or "10S" (one deck, so rank+suit is unique). */
  id: string;
  rank: Rank;
  suit: Suit;
}

/**
 * A penalty waiting for the current player to answer:
 * - twos:      a 2 was played; draw `amount` or stack another 2 (+2).
 * - aceSpades: the A♠ was played; draw 5 or pass it on with another Ace.
 * - skip:      an 8 was played; lose your turn or pass it on with another 8.
 */
export type Pending =
  | { kind: 'twos'; amount: number }
  | { kind: 'aceSpades'; amount: number }
  | { kind: 'skip' }
  | null;

export interface Player {
  name: string;
  isHuman: boolean;
  hand: Card[];
  /** Running total across rounds. 502 or more = eliminated. */
  totalScore: number;
  /** Penalty points scored in the most recent round. */
  roundPoints: number;
  eliminated: boolean;
}

/**
 * playing   – a round is in progress
 * roundOver – round finished, scores shown, waiting for "Next round"
 * gameOver  – only one player left (or tie-break decided), show winner
 */
export type Phase = 'playing' | 'roundOver' | 'gameOver';

export interface GameState {
  phase: Phase;
  players: Player[];
  drawPile: Card[];
  /** Last element is the top card. */
  discardPile: Card[];
  /** Index into `players` of whose turn it is. */
  currentPlayer: number;
  /** The suit that must be followed (top card's suit, or the suit a Jack named). */
  activeSuit: Suit;
  pending: Pending;
  roundNumber: number;
  roundWinner: number | null;
  gameWinner: number | null;
  /** Players knocked out at the end of the latest round. */
  eliminatedThisRound: number[];
  /** What just happened – shown in the UI banner. */
  message: string;
  /** Set when an invalid action was attempted; null otherwise. */
  error: string | null;
}

export interface PlayerSetup {
  name: string;
  isHuman: boolean;
}

/** Everything that can happen in the game. The reducer handles each one. */
export type GameAction =
  | {
      type: 'PLAY_CARD';
      playerIndex: number;
      cardId: string;
      chosenSuit?: Suit;
    }
  | { type: 'DRAW_CARD'; playerIndex: number }
  | { type: 'ACCEPT_PENALTY'; playerIndex: number }
  | { type: 'NEXT_ROUND' }
  | { type: 'NEW_GAME'; players: PlayerSetup[] };
