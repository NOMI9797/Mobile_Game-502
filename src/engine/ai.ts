/**
 * ai.ts
 * Decides the move for a computer player ("bot").
 *
 * The bot never changes the state itself – it only returns an ordinary
 * GameAction, exactly like a button press from the human. The reducer then
 * checks and applies it, so bots follow precisely the same rules.
 *
 * Strategy (simple but sensible):
 *  1. A penalty is waiting → answer it if possible (pass it on), else accept.
 *  2. Nothing playable → draw.
 *  3. 7♥ → play it when ending the round now is good for us.
 *  4. Otherwise get rid of the most expensive normal card first, preferring a
 *     suit we hold more of (so we can keep following it).
 *  5. Jacks are kept as a backup; when played, name our most common suit.
 */
import { cardPoints, isSevenOfHearts, handPoints, SUITS } from './deck';
import { getPlayableCards } from './rules';
import { Card, GameAction, GameState, Suit } from './types';

/** The suit the bot holds most of (ignoring the given card). */
export function bestSuitFor(hand: Card[], ignoreId?: string): Suit {
  const counts: Record<Suit, number> = { S: 0, H: 0, D: 0, C: 0 };
  hand.forEach(card => {
    if (card.id !== ignoreId && card.rank !== 'J') counts[card.suit]++;
  });
  return SUITS.reduce((best, suit) => (counts[suit] > counts[best] ? suit : best), SUITS[0]);
}

/** Fewest cards held by any other player still in the game. */
function smallestOpponentHand(state: GameState, me: number): number {
  return Math.min(
    ...state.players
      .filter((p, i) => i !== me && !p.eliminated)
      .map(p => p.hand.length),
  );
}

/** Should the bot finish the round now with the 7♥? */
function shouldPlaySevenOfHearts(state: GameState, me: number, onlyOption: boolean): boolean {
  const hand = state.players[me].hand;
  const leftover = handPoints(hand.filter(c => !isSevenOfHearts(c)));
  if (hand.length === 1) return true; // it's our last card anyway
  if (smallestOpponentHand(state, me) <= 2) return true; // someone is about to go out
  if (leftover <= 40) return true; // little to lose
  return onlyOption && leftover <= 80;
}

export function chooseAiAction(state: GameState, me: number): GameAction {
  const hand = state.players[me].hand;
  const playable = getPlayableCards(state, me);

  // 1. Penalty waiting: pass it on if we can (2 on 2, Ace on A♠, 8 on 8).
  if (state.pending) {
    if (playable.length > 0) {
      const card = playable[0];
      return { type: 'PLAY_CARD', playerIndex: me, cardId: card.id };
    }
    return { type: 'ACCEPT_PENALTY', playerIndex: me };
  }

  // 2. Nothing to play.
  if (playable.length === 0) return { type: 'DRAW_CARD', playerIndex: me };

  const normal = playable.filter(c => c.rank !== 'J' && !isSevenOfHearts(c));
  const jacks = playable.filter(c => c.rank === 'J');
  const seven = playable.find(isSevenOfHearts);

  // 3. 7♥ – end the round when it suits us.
  if (seven && shouldPlaySevenOfHearts(state, me, normal.length + jacks.length === 0)) {
    return { type: 'PLAY_CARD', playerIndex: me, cardId: seven.id };
  }

  // 4. Most expensive normal card; tie-break on how many of that suit we hold.
  if (normal.length > 0) {
    const sameSuitCount = (card: Card) => hand.filter(h => h.suit === card.suit).length;
    const score = (card: Card) => cardPoints(card) * 100 + sameSuitCount(card);
    const best = normal.reduce((a, b) => (score(b) > score(a) ? b : a));
    return { type: 'PLAY_CARD', playerIndex: me, cardId: best.id };
  }

  // 5. Only a Jack (or a 7♥ we decided to keep) is playable.
  if (jacks.length > 0) {
    const jack = jacks[0];
    return {
      type: 'PLAY_CARD',
      playerIndex: me,
      cardId: jack.id,
      chosenSuit: bestSuitFor(hand, jack.id),
    };
  }

  // Holding the 7♥ back – draw instead.
  return { type: 'DRAW_CARD', playerIndex: me };
}
