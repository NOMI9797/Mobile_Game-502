/**
 * HowToPlayModal.tsx
 * Short, illustrated rules of 502. Opened from the Home screen and from the
 * "?" button during a game.
 */
import React from 'react';
import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';
import AppButton from './AppButton';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const STEPS = [
  'Everyone gets 7 cards. One card is turned face-up: that is the top card.',
  'On your turn, play ONE card that matches the top card by SUIT (♠ ♥ ♦ ♣) or by VALUE (e.g. any 9). Cards you can play are raised with a teal border.',
  "Can't (or don't want to) play? Tap Draw a card. Your turn ends – a drawn card waits until your next turn.",
  'Get rid of all your cards to win the round.',
];

const SPECIALS: [string, string][] = [
  ['J', 'Wild – play it on anything and choose the next suit.'],
  ['7♥', 'Wild – ends the round at once. You win the round.'],
  ['2', 'Next player draws 2 – unless they add another 2 (4, 6, 8 …).'],
  ['A♠', 'Next player draws 5 – unless they pass it on with another Ace.'],
  ['8', 'Next player is skipped – unless they pass it on with an 8.'],
];

const POINTS: [string, string][] = [
  ['7♥, A♠', '100'],
  ['2, 8, Jack', '30'],
  ['A♥ A♦ A♣', '20'],
  ['10, Q, K', '10'],
  ['3 4 5 6 7 9', '5'],
];

export default function HowToPlayModal({ visible, onClose }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>How to play 502</Text>
          <ScrollView style={styles.scroll}>
            <Text style={styles.section}>🎯 Goal</Text>
            <Text style={styles.text}>
              Empty your hand first. Cards left in your hand are penalty points.
              Reach 502 points and you're out. The last player left wins the
              game.
            </Text>

            <Text style={styles.section}>🃏 Your turn</Text>
            {STEPS.map((s, i) => (
              <View key={i} style={styles.row}>
                <Text style={styles.num}>{i + 1}</Text>
                <Text style={[styles.text, styles.flex]}>{s}</Text>
              </View>
            ))}

            <Text style={styles.section}>⭐ Special cards</Text>
            {SPECIALS.map(([card, what]) => (
              <View key={card} style={styles.row}>
                <Text style={styles.badge}>{card}</Text>
                <Text style={[styles.text, styles.flex]}>{what}</Text>
              </View>
            ))}
            <Text style={[styles.text, styles.note]}>
              ⚠️ When a 2, A♠ or 8 hits you, you may ONLY answer with the same
              kind of card – or tap Accept. A Jack or 7♥ can't cancel it.
            </Text>

            <Text style={styles.section}>🧮 Points for cards left in hand</Text>
            {POINTS.map(([cardsText, pts]) => (
              <View key={cardsText} style={styles.pointRow}>
                <Text style={styles.text}>{cardsText}</Text>
                <Text style={styles.pts}>{pts}</Text>
              </View>
            ))}
            <Text style={[styles.text, styles.note]}>
              After each round, anyone at 502+ is eliminated (the round winner
              is safe that round). If everyone passes 502 together, the lowest
              total wins.
            </Text>
          </ScrollView>
          <AppButton title="Got it" onPress={onClose} style={styles.close} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  sheet: {
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.accent,
    fontSize: font.heading,
    fontWeight: '900',
    marginBottom: spacing.sm,
  },
  scroll: { flexGrow: 0 },
  section: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '800',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  text: { color: colors.text, fontSize: font.body, lineHeight: 21 },
  flex: { flex: 1 },
  row: { flexDirection: 'row', marginBottom: spacing.sm },
  num: {
    color: colors.accent,
    fontWeight: '900',
    width: 22,
    fontSize: font.body,
  },
  badge: {
    width: 44,
    marginRight: spacing.sm,
    textAlign: 'center',
    color: colors.background,
    backgroundColor: colors.cardFace,
    borderRadius: radius.sm,
    fontWeight: '900',
    paddingVertical: 2,
    overflow: 'hidden',
  },
  note: { color: colors.warning, marginTop: spacing.sm },
  pointRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pts: { color: colors.accent, fontWeight: '900' },
  close: { marginTop: spacing.lg },
});
