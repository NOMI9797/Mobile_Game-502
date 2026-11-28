/**
 * rules.ts
 * "Is this move allowed?" – the matching rules of 502.
 * Used by the reducer (to reject bad moves), the UI (to highlight playable
 * cards) and the AI (to pick a move).
 */
import { SUIT_NAME, SUIT_SYMBOL, cardLabel, isSevenOfHearts } from './deck';
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

/** "♥ Hearts" – symbol + name, used in hints and warnings. */
function suitWords(state: GameState): string {
  return `${SUIT_SYMBOL[state.activeSuit]} ${SUIT_NAME[state.activeSuit]}`;
}

/** What a legal normal play looks like right now, e.g. "a ♦ Diamonds card or a 9". */
function matchWords(state: GameState): string {
  const top = topCard(state);
  // After a Jack the named suit is what counts (another Jack is wild anyway).
  if (top.rank === 'J') return `a ${suitWords(state)} card`;
  return `a ${suitWords(state)} card or a ${top.rank}`;
}

/**
 * Explains in plain words WHY a card can't be played – shown to the player
 * as a warning when they tap a wrong card.
 */
export function whyCantPlay(state: GameState, card: Card): string {
  const label = cardLabel(card);
  const pending = state.pending;
  if (pending?.kind === 'twos')
    return `You can't play ${label} now: a draw-${pending.amount} penalty is waiting. Only a 2 can answer it – or tap Accept.`;
  if (pending?.kind === 'aceSpades')
    return `You can't play ${label} now: the A♠ penalty (draw 5) is waiting. Only an Ace can pass it on – or tap Accept.`;
  if (pending?.kind === 'skip')
    return `You can't play ${label} now: you are being skipped. Only an 8 can pass the skip on – or tap Accept skip.`;
  return `You can't play ${label}: it doesn't match. Play ${matchWords(
    state,
  )}. Jacks and 7♥ are wild.`;
}

/**
 * "What can I do?" – a one-line hint for the player whose turn it is.
 */
export function turnHint(state: GameState, playerIndex: number): string {
  const pending = state.pending;
  if (pending?.kind === 'twos')
    return `Play a 2 to pass it on (next player draws ${
      pending.amount + 2
    }), or tap "Accept – draw ${pending.amount}".`;
  if (pending?.kind === 'aceSpades')
    return 'Play any Ace to pass the 5 cards on, or tap "Accept – draw 5".';
  if (pending?.kind === 'skip')
    return 'Play an 8 to pass the skip on, or tap "Accept skip" to lose this turn.';
  const playable = getPlayableCards(state, playerIndex).length;
  if (playable === 0)
    return `Nothing matches – you need ${matchWords(
      state,
    )}. Tap "No match – draw a card".`;
  return `Tap a raised card: ${matchWords(
    state,
  )}. Jacks and 7♥ are wild. Or draw a card.`;
}
