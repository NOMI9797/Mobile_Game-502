/**
 * useGame.ts
 * Connects the engine to React:
 *  - keeps the game state in `useReducer(gameReducer)`
 *  - plays the bots' turns automatically after a short "thinking" delay
 *  - gives the screen simple functions (playCard, drawCard, ...)
 */
import { useCallback, useEffect, useReducer } from 'react';
import {
  PlayerSetup,
  Suit,
  chooseAiAction,
  createGame,
  gameReducer,
} from '../engine';

const BOT_DELAY_MS = 1300; // slow enough to follow what each bot does
const FAST_BOT_DELAY_MS = 350; // once you're eliminated and just watching

export function useGame(setups: PlayerSetup[]) {
  // createGame(setups) builds the first state (lazy initialiser).
  const [state, dispatch] = useReducer(gameReducer, setups, createGame);

  const humanIndex = state.players.findIndex(p => p.isHuman);
  const isHumanTurn =
    state.phase === 'playing' && state.currentPlayer === humanIndex;

  // Bot turns: whenever it's a bot's turn, wait a moment, then let the AI move.
  useEffect(() => {
    if (state.phase !== 'playing') return;
    const current = state.players[state.currentPlayer];
    if (current.isHuman) return;

    const watching = state.players[humanIndex]?.eliminated;
    const timer = setTimeout(
      () => dispatch(chooseAiAction(state, state.currentPlayer)),
      watching ? FAST_BOT_DELAY_MS : BOT_DELAY_MS,
    );
    // If the state changes first (or the screen closes), cancel the old timer.
    return () => clearTimeout(timer);
  }, [state, humanIndex]);

  const playCard = useCallback(
    (cardId: string, chosenSuit?: Suit) =>
      dispatch({
        type: 'PLAY_CARD',
        playerIndex: humanIndex,
        cardId,
        chosenSuit,
      }),
    [humanIndex],
  );
  const drawCard = useCallback(
    () => dispatch({ type: 'DRAW_CARD', playerIndex: humanIndex }),
    [humanIndex],
  );
  const acceptPenalty = useCallback(
    () => dispatch({ type: 'ACCEPT_PENALTY', playerIndex: humanIndex }),
    [humanIndex],
  );
  const nextRound = useCallback(() => dispatch({ type: 'NEXT_ROUND' }), []);
  const restart = useCallback(
    () => dispatch({ type: 'NEW_GAME', players: setups }),
    [setups],
  );

  return {
    state,
    humanIndex,
    isHumanTurn,
    playCard,
    drawCard,
    acceptPenalty,
    nextRound,
    restart,
  };
}
