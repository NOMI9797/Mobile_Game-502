/**
 * GameScreen.tsx
 * The game table:
 *   top    – round number, How to play / Scores / Restart / Quit, the bots' seats
 *   banner – WHOSE TURN it is, plus a hint telling you what you can do
 *   middle – draw pile, top card, suit to follow, penalty, the last moves
 *   bottom – your hand (playable cards raised) and the Draw / Accept button;
 *            a wrong move shows a red "Not allowed" warning explaining why
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  BackHandler,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../components/AppButton';
import GameOverModal from '../components/GameOverModal';
import HowToPlayModal from '../components/HowToPlayModal';
import MoveWarning from '../components/MoveWarning';
import OpponentSeat from '../components/OpponentSeat';
import PlayingCard from '../components/PlayingCard';
import RoundSummaryModal from '../components/RoundSummaryModal';
import ScoreTable from '../components/ScoreTable';
import SuitPicker from '../components/SuitPicker';
import TurnBanner, { TurnMode } from '../components/TurnBanner';
import {
  Card,
  GameState,
  PlayerSetup,
  RANKS,
  SUITS,
  SUIT_NAME,
  SUIT_SYMBOL,
  Suit,
  canPlayCard,
  pendingText,
  topCard,
  turnHint,
} from '../engine';
import { useGame } from '../hooks/useGame';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  setups: PlayerSetup[];
  onExit: () => void;
}

/** Show the hand grouped by suit, then by rank (display order only). */
function sortHand(hand: Card[]): Card[] {
  return [...hand].sort(
    (a, b) =>
      SUITS.indexOf(a.suit) - SUITS.indexOf(b.suit) ||
      RANKS.indexOf(a.rank) - RANKS.indexOf(b.rank),
  );
}

export default function GameScreen({ setups, onExit }: Props) {
  const insets = useSafeAreaInsets();
  const game = useGame(setups);
  const { state, humanIndex, isHumanTurn } = game;
  const me = state.players[humanIndex];
  const top = topCard(state);

  const [jackToPlay, setJackToPlay] = useState<string | null>(null);
  const [showScores, setShowScores] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [warning, setWarning] = useState<{ text: string; id: number } | null>(
    null,
  );
  const [moves, setMoves] = useState<string[]>([]);

  // ----- every new state: a wrong move → warning; a real move → move list ---
  const lastState = useRef<GameState | null>(null);
  useEffect(() => {
    if (state === lastState.current) return;
    lastState.current = state;
    if (state.error) {
      const text = state.error;
      setWarning(w => ({ text, id: (w?.id ?? 0) + 1 }));
      return;
    }
    setWarning(null);
    setMoves(m => [state.message, ...m].slice(0, 3)); // newest first
  }, [state]);

  // The warning closes by itself after 3.5 seconds (or when tapped).
  useEffect(() => {
    if (!warning) return;
    const timer = setTimeout(() => setWarning(null), 3500);
    return () => clearTimeout(timer);
  }, [warning]);

  // ----- Android back button: ask before leaving a game -----
  const confirmQuit = () =>
    Alert.alert('Leave game?', 'Your current game will be lost.', [
      { text: 'Stay', style: 'cancel' },
      { text: 'Yes, leave', style: 'destructive', onPress: onExit },
    ]);
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      confirmQuit();
      return true; // we handled it
    });
    return () => sub.remove();
  });

  const confirmRestart = () =>
    Alert.alert(
      'Restart game?',
      'Scores go back to 0 and new cards are dealt.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes, restart', style: 'destructive', onPress: game.restart },
      ],
    );

  // ----- animations -----
  // Discard pile: each new top card pops in.
  const pop = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    pop.setValue(0);
    Animated.spring(pop, {
      toValue: 1,
      friction: 6,
      useNativeDriver: true,
    }).start();
  }, [top.id, pop]);
  const popScale = pop.interpolate({
    inputRange: [0, 1],
    outputRange: [1.35, 1],
  });
  const popRotate = pop.interpolate({
    inputRange: [0, 1],
    outputRange: ['-12deg', '0deg'],
  });

  // Hand slides up when a new round is dealt.
  const deal = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    deal.setValue(0);
    Animated.timing(deal, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [state.roundNumber, deal]);
  const dealY = deal.interpolate({ inputRange: [0, 1], outputRange: [120, 0] });

  // ----- your hand -----
  const hand = useMemo(() => sortHand(me.hand), [me.hand]);
  const playableIds = useMemo(
    () =>
      new Set(
        isHumanTurn
          ? me.hand.filter(c => canPlayCard(state, c)).map(c => c.id)
          : [],
      ),
    [isHumanTurn, me.hand, state],
  );

  // ----- responsive layout from the screen width -----
  const { width: screenWidth } = useWindowDimensions();
  const usable = screenWidth - spacing.lg * 2;

  // Hand: squeeze the cards together so they fit the screen. Each card keeps
  // at least MIN_VISIBLE px showing; beyond that the hand scrolls sideways.
  const CARD_W = 62;
  const MIN_VISIBLE = 24;
  const overlap =
    hand.length <= 1
      ? 0
      : Math.min(
          6,
          Math.max(
            MIN_VISIBLE - CARD_W,
            (usable - CARD_W) / (hand.length - 1) - CARD_W,
          ),
        );

  // Bot seats share the row equally (between 64 and 96 px wide).
  const botCount = state.players.length - 1;
  const seatWidth = Math.max(
    64,
    Math.min(96, (usable - spacing.sm * botCount) / botCount),
  );

  const onCardPress = (card: Card) => {
    // Jack (not your last card): ask which suit to name first.
    if (
      card.rank === 'J' &&
      isHumanTurn &&
      playableIds.has(card.id) &&
      me.hand.length > 1
    ) {
      setJackToPlay(card.id);
      return;
    }
    game.playCard(card.id); // the engine rejects invalid moves and sets an error
  };

  const onPickSuit = (suit: Suit) => {
    if (jackToPlay) game.playCard(jackToPlay, suit);
    setJackToPlay(null);
  };

  // ----- status text -----
  const current = state.players[state.currentPlayer];
  const penalty = pendingText(state);
  const jackChangedSuit = top.rank === 'J' && state.activeSuit !== top.suit;
  const turnMode: TurnMode = me.eliminated
    ? 'out'
    : state.phase !== 'playing'
    ? 'idle'
    : isHumanTurn
    ? 'you'
    : 'bot';
  const turnTitle = {
    out: 'You are out – watching the bots',
    idle: 'Round over',
    you: 'Your turn',
    bot: `${current.name} is thinking…`,
  }[turnMode];

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.sm }]}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <Text style={styles.round}>Round {state.roundNumber}</Text>
        <View style={styles.topButtons}>
          <AppButton
            title="?"
            size="small"
            variant="secondary"
            onPress={() => setShowHelp(true)}
            style={styles.helpButton}
          />
          <AppButton
            title="Scores"
            size="small"
            variant="secondary"
            onPress={() => setShowScores(true)}
            style={styles.topButton}
          />
          <AppButton
            title="Restart"
            size="small"
            variant="secondary"
            onPress={confirmRestart}
            style={styles.topButton}
          />
          <AppButton
            title="Quit"
            size="small"
            variant="secondary"
            onPress={confirmQuit}
            style={styles.topButton}
          />
        </View>
      </View>

      {/* Opponents */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.opponents}
        contentContainerStyle={styles.opponentsContent}
      >
        {state.players.map((p, i) =>
          i === humanIndex ? null : (
            <OpponentSeat
              key={i}
              player={p}
              width={seatWidth}
              isTurn={state.phase === 'playing' && state.currentPlayer === i}
            />
          ),
        )}
      </ScrollView>

      {/* Whose turn + what you can do */}
      <TurnBanner
        mode={turnMode}
        title={turnTitle}
        initial={current.name[0]}
        hint={turnMode === 'you' ? turnHint(state, humanIndex) : null}
        urgent={!!state.pending}
      />

      {/* Table */}
      <View style={styles.table}>
        {/* Penalty strip at the TOP of the table, so the "Not allowed"
            warning (at the bottom) never covers it. */}
        {penalty && (
          <View style={styles.penalty}>
            <Text style={styles.penaltyText}>
              {current.isHuman ? 'You: ' : `${current.name}: `}
              {penalty}
            </Text>
          </View>
        )}
        <View style={styles.piles}>
          <View style={styles.pileBox}>
            <PlayingCard
              faceDown
              size="lg"
              dimmed={!isHumanTurn || !!state.pending}
              onPress={game.drawCard}
            />
            <Text style={styles.pileLabel}>
              Draw pile · {state.drawPile.length}
            </Text>
          </View>
          <View style={styles.pileBox}>
            <Animated.View
              style={{
                transform: [{ scale: popScale }, { rotate: popRotate }],
              }}
            >
              <PlayingCard card={top} size="lg" />
            </Animated.View>
            <Text style={styles.pileLabel}>Top card</Text>
          </View>
        </View>

        <View style={[styles.suitChip, jackChangedSuit && styles.suitChipJack]}>
          <Text
            style={[
              styles.suitSymbol,
              {
                color:
                  state.activeSuit === 'H' || state.activeSuit === 'D'
                    ? colors.suitRed
                    : colors.text,
              },
            ]}
          >
            {SUIT_SYMBOL[state.activeSuit]}
          </Text>
          <Text style={styles.suitText}>
            {jackChangedSuit ? 'Jack called ' : 'Follow '}
            {SUIT_NAME[state.activeSuit]}
          </Text>
        </View>

        {/* Last moves, newest first */}
        <View style={styles.moves}>
          {moves.map((m, i) => (
            <Text
              key={i}
              style={i === 0 ? styles.message : styles.oldMove}
              numberOfLines={2}
            >
              {m}
            </Text>
          ))}
        </View>
        {/* Wrong move → "Not allowed" box over the bottom of the table */}
        <MoveWarning
          message={warning?.text ?? null}
          id={warning?.id ?? 0}
          onDismiss={() => setWarning(null)}
        />
      </View>

      {/* Your area */}
      <View
        style={[
          styles.myArea,
          isHumanTurn && styles.myAreaActive,
          { paddingBottom: insets.bottom + spacing.md },
        ]}
      >
        <View style={styles.myHeader}>
          <Text style={[styles.turn, isHumanTurn && styles.turnActive]}>
            Your cards · {me.hand.length}
          </Text>
          <Text style={styles.myScore}>
            {me.name} · {me.totalScore} pts
          </Text>
        </View>

        <Animated.View
          style={{ transform: [{ translateY: dealY }], opacity: deal }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.handContent}
          >
            {hand.map((card, i) => (
              <PlayingCard
                key={card.id}
                card={card}
                size="md"
                playable={playableIds.has(card.id)}
                dimmed={isHumanTurn && !playableIds.has(card.id)}
                onPress={() => onCardPress(card)}
                style={{ marginLeft: i === 0 ? 0 : overlap }}
              />
            ))}
          </ScrollView>
        </Animated.View>

        <View style={styles.actions}>
          {isHumanTurn && state.pending ? (
            <AppButton
              variant="warning"
              title={
                state.pending.kind === 'skip'
                  ? 'Accept skip'
                  : `Accept – draw ${state.pending.amount}`
              }
              onPress={game.acceptPenalty}
            />
          ) : (
            <AppButton
              title={
                isHumanTurn && playableIds.size === 0
                  ? 'No match – draw a card'
                  : 'Draw a card'
              }
              onPress={game.drawCard}
              disabled={!isHumanTurn}
            />
          )}
        </View>
      </View>

      {/* Pop-ups */}
      <HowToPlayModal visible={showHelp} onClose={() => setShowHelp(false)} />
      <SuitPicker
        visible={jackToPlay !== null}
        onPick={onPickSuit}
        onCancel={() => setJackToPlay(null)}
      />

      <Modal
        visible={showScores}
        transparent
        animationType="fade"
        onRequestClose={() => setShowScores(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.scoreSheet}>
            <Text style={styles.scoreTitle}>Scoreboard</Text>
            <ScoreTable state={state} />
            <AppButton
              title="Close"
              onPress={() => setShowScores(false)}
              style={styles.close}
            />
          </View>
        </View>
      </Modal>

      <RoundSummaryModal
        state={state}
        onNextRound={game.nextRound}
        onQuit={onExit}
      />
      <GameOverModal state={state} onPlayAgain={game.restart} onMenu={onExit} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  round: { color: colors.text, fontSize: font.title, fontWeight: '900' },
  topButtons: { flexDirection: 'row' },
  topButton: { marginLeft: spacing.sm },
  helpButton: { minWidth: 36 },
  opponents: { flexGrow: 0, marginTop: spacing.md },
  opponentsContent: {
    paddingHorizontal: spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  table: {
    flex: 1,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.table,
    borderWidth: 2,
    borderColor: colors.tableEdge,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  piles: { flexDirection: 'row' },
  pileBox: { alignItems: 'center', marginHorizontal: spacing.lg },
  pileLabel: {
    color: colors.textMuted,
    marginTop: spacing.sm,
    fontSize: font.small,
  },
  suitChip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  suitChipJack: { borderWidth: 1.5, borderColor: colors.accent },
  suitSymbol: { fontSize: font.title, marginRight: 6 },
  suitText: { color: colors.text, fontWeight: '700' },
  moves: { marginTop: spacing.md, alignItems: 'center' },
  message: {
    color: colors.text,
    textAlign: 'center',
    fontSize: font.body,
    fontWeight: '700',
  },
  oldMove: {
    color: colors.textMuted,
    textAlign: 'center',
    fontSize: font.small,
    marginTop: 2,
  },
  penalty: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    backgroundColor: colors.warning,
  },
  penaltyText: { color: colors.background, fontWeight: '900' },
  myArea: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderTopWidth: 2,
    borderColor: colors.border,
    paddingTop: spacing.md,
  },
  myAreaActive: { borderColor: colors.accent },
  myHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  turn: { color: colors.textMuted, fontWeight: '800' },
  turnActive: { color: colors.accent },
  myScore: { color: colors.textMuted },
  handContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg + 4,
    paddingBottom: 4,
  },
  actions: { paddingHorizontal: spacing.lg, marginTop: spacing.sm },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  scoreSheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scoreTitle: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '900',
    marginBottom: spacing.lg,
  },
  close: { marginTop: spacing.lg },
});
