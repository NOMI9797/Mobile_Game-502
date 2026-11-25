/**
 * RoundSummaryModal.tsx
 * Shown when a round ends (phase "roundOver"): who won the round, the score
 * table, and a Lottie "knocked out" animation if anyone was eliminated.
 */
import LottieView from 'lottie-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameState } from '../engine';
import { colors, font, radius, spacing } from '../theme';
import AppButton from './AppButton';
import ScoreTable from './ScoreTable';

interface Props {
  state: GameState;
  onNextRound: () => void;
  onQuit: () => void;
}

export default function RoundSummaryModal({
  state,
  onNextRound,
  onQuit,
}: Props) {
  const visible = state.phase === 'roundOver';
  const winner =
    state.roundWinner !== null ? state.players[state.roundWinner] : null;
  const someoneOut = state.eliminatedThisRound.length > 0;
  const humanOut = state.players.some(p => p.isHuman && p.eliminated);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onNextRound}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.kicker}>
              ROUND {state.roundNumber} COMPLETE
            </Text>
            <Text style={styles.title}>
              {winner
                ? `${winner.isHuman ? 'You' : winner.name} won the round`
                : 'Round over'}
            </Text>
            <Text style={styles.message}>{state.message}</Text>

            {someoneOut && (
              <View style={styles.outBox}>
                <LottieView
                  source={require('../assets/lottie/eliminated.json')}
                  autoPlay
                  loop={false}
                  style={styles.lottie}
                />
                <Text style={styles.outText}>
                  Eliminated:{' '}
                  {state.eliminatedThisRound
                    .map(i => state.players[i].name)
                    .join(', ')}
                </Text>
              </View>
            )}

            <ScoreTable state={state} />

            <AppButton
              title={humanOut ? 'Watch the bots finish' : 'Next round'}
              onPress={onNextRound}
              style={styles.button}
            />
            <AppButton
              title="Quit to menu"
              variant="secondary"
              onPress={onQuit}
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: { padding: spacing.xl },
  kicker: {
    color: colors.accent,
    fontWeight: '800',
    letterSpacing: 2,
    fontSize: font.small,
  },
  title: {
    color: colors.text,
    fontSize: font.heading,
    fontWeight: '900',
    marginTop: 4,
  },
  message: { color: colors.textMuted, marginVertical: spacing.md },
  outBox: { alignItems: 'center', marginBottom: spacing.md },
  lottie: { width: 120, height: 120 },
  outText: { color: colors.danger, fontWeight: '800' },
  button: { marginTop: spacing.lg, marginBottom: spacing.sm },
});
