/**
 * deck.ts
 * Building and shuffling the 52-card deck, and the point value of each card.
 */
import { Card, Rank, Suit } from './types';

export const SUITS: Suit[] = ['S', 'H', 'D', 'C'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const SUIT_SYMBOL: Record<Suit, string> = { S: '♠', H: '♥', D: '♦', C: '♣' };
export const SUIT_NAME: Record<Suit, string> = {
  S: 'Spades',
  H: 'Hearts',
  D: 'Diamonds',
  C: 'Clubs',
};

/** Standard 52-card deck, no jokers. */
export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: rank + suit, rank, suit });
    }
  }
  return deck;
}

/** Fisher–Yates shuffle. Returns a NEW array (does not change the input). */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export const isSevenOfHearts = (card: Card) => card.rank === '7' && card.suit === 'H';
export const isAceOfSpades = (card: Card) => card.rank === 'A' && card.suit === 'S';

/**
 * Penalty points for a card left in hand at the end of a round:
 * 7♥ and A♠ = 100 · 2, 8, Jack = 30 · other Aces = 20 · 10, Q, K = 10 · everything else = 5
 */
export function cardPoints(card: Card): number {
  if (isSevenOfHearts(card) || isAceOfSpades(card)) return 100;
  if (card.rank === '2' || card.rank === '8' || card.rank === 'J') return 30;
  if (card.rank === 'A') return 20;
  if (card.rank === '10' || card.rank === 'Q' || card.rank === 'K') return 10;
  return 5; // 3, 4, 5, 6, 9 and the other 7s
}

export function handPoints(hand: Card[]): number {
  return hand.reduce((sum, card) => sum + cardPoints(card), 0);
}

/**
 * The first card of the discard pile may not be a special card:
 * a 2, a Jack, any Ace, or the 7♥. If it is, it goes back and another is flipped.
 */
export function isValidStartCard(card: Card): boolean {
  return !(card.rank === '2' || card.rank === 'J' || card.rank === 'A' || isSevenOfHearts(card));
}

/** "7♥", "10♠" … */
export function cardLabel(card: Card): string {
  return card.rank + SUIT_SYMBOL[card.suit];
}
