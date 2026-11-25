/**
 * rules.ts
 * "Is this move allowed?" – the matching rules of 502.
 * Used by the reducer (to reject bad moves), the UI (to highlight playable
 * cards) and the AI (to pick a move).
 */
import { SUIT_NAME, isSevenOfHearts } from './deck';
import { Card, GameState } from './types';

export function topCard(state: GameState): Card {
  return state.discardPile[state.discardPile.length - 1];
}

export function canPlayCard(state: GameState, card: Card): boolean {
  const pending = state.pending;

  // While a penalty is waiting you may ONLY answer with the matching type.
  // Jacks and the 7♥ cannot cancel a penalty.
  if (pending) {
    if (pending.kind === 'twos') return card.rank === '2';
    if (pending.kind === 'aceSpades') return card.rank === 'A';
    return card.rank === '8'; // skip
  }

  // Wild cards: Jack (names a suit) and 7♥ (ends the round).
  if (card.rank === 'J' || isSevenOfHearts(card)) return true;

  // Normal play: match the suit to follow, or the value of the top card.
  // (After a Jack, the suit to follow is the suit the Jack named.)
  return card.suit === state.activeSuit || card.rank === topCard(state).rank;
}

export function getPlayableCards(
  state: GameState,
  playerIndex: number,
): Card[] {
  return state.players[playerIndex].hand.filter(card =>
    canPlayCard(state, card),
  );
}

/** Short text describing the waiting penalty, for banners. */
export function pendingText(state: GameState): string | null {
  const pending = state.pending;
  if (!pending) return null;
  if (pending.kind === 'twos')
    return `Draw ${pending.amount} – or stack another 2`;
  if (pending.kind === 'aceSpades')
    return `Draw ${pending.amount} – or pass it on with an Ace`;
  return 'Skipped – or pass it on with an 8';
}

/** e.g. "Follow Hearts" – useful after a Jack changed the suit. */
export function activeSuitText(state: GameState): string {
  return `Follow ${SUIT_NAME[state.activeSuit]}`;
}
