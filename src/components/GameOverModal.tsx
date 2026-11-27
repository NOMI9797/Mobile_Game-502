/**
 * GameOverModal.tsx
 * Shown when the game ends (phase "gameOver"). Confetti (Lottie) if you won,
 * the "knocked out" animation if a bot won. Offers Play again / Menu.
 */
import LottieView from 'lottie-react-native';
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GameState } from '../engine';
import { colors, font, radius, spacing } from '../theme';
import AppButton from './AppButton';

interface Props {
  state: GameState;
  onPlayAgain: () => void;
  onMenu: () => void;
}

export default function GameOverModal({ state, onPlayAgain, onMenu }: Props) {
  const visible = state.phase === 'gameOver';
  const winner =
    state.gameWinner !== null ? state.players[state.gameWinner] : null;
  const youWon = !!winner?.isHuman;

  // Final standings: winner first, then everyone else by lowest total.
  const standings = state.players
    .map((p, i) => ({ p, i }))
    .sort((a, b) =>
      a.i === state.gameWinner
        ? -1
        : b.i === state.gameWinner
        ? 1
        : a.p.totalScore - b.p.totalScore,
    );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onMenu}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <ScrollView contentContainerStyle={styles.content}>
            <LottieView
              source={
                youWon
                  ? require('../assets/lottie/confetti.json')
                  : require('../assets/lottie/eliminated.json')
              }
              autoPlay
              loop={youWon}
              style={styles.lottie}
            />
            <Text
              style={[
                styles.title,
                { color: youWon ? colors.accent : colors.danger },
              ]}
            >
              {youWon ? 'You win!' : 'Game over'}
            </Text>
            <Text style={styles.subtitle}>
              {youWon
                ? 'Everyone else crossed 502. You are the last one standing.'
                : `${winner?.name ?? 'Nobody'} is the last player under 502.`}
            </Text>

            {standings.map(({ p, i }, place) => (
              <View
                key={i}
                style={[styles.row, place === 0 && styles.firstRow]}
              >
                <Text style={styles.place}>{place + 1}</Text>
                <Text style={styles.name}>
                  {p.name}
                  {p.isHuman && p.name !== 'You' ? ' (you)' : ''}
                </Text>
                <Text style={styles.score}>{p.totalScore}</Text>
              </View>
            ))}

            <AppButton
              title="Play again"
              onPress={onPlayAgain}
              style={styles.button}
            />
            <AppButton title="Main menu" variant="secondary" onPress={onMenu} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    maxHeight: '92%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  content: { padding: spacing.xl, alignItems: 'stretch' },
  lottie: { width: 180, height: 180, alignSelf: 'center' },
  title: { fontSize: font.hero, fontWeight: '900', textAlign: 'center' },
  subtitle: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.sm,
    marginBottom: 4,
    backgroundColor: colors.surfaceRaised,
  },
  firstRow: { borderWidth: 1, borderColor: colors.accent },
  place: { color: colors.accent, fontWeight: '900', width: 24 },
  name: { color: colors.text, flex: 1, fontWeight: '700' },
  score: { color: colors.text, fontWeight: '900' },
  button: { marginTop: spacing.xl, marginBottom: spacing.sm },
});
