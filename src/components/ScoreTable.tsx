/**
 * ScoreTable.tsx
 * Every player's points this round, running total, and a bar showing how
 * close they are to 502 (amber when getting close, red when out).
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ELIMINATION_SCORE, GameState } from '../engine';
import { colors, font, radius, spacing } from '../theme';

export default function ScoreTable({ state }: { state: GameState }) {
  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={[styles.header, styles.nameCol]}>Player</Text>
        <Text style={styles.header}>Round</Text>
        <Text style={styles.header}>Total</Text>
      </View>
      {state.players.map((p, i) => {
        const ratio = Math.min(p.totalScore / ELIMINATION_SCORE, 1);
        const barColor = p.eliminated
          ? colors.danger
          : ratio > 0.75
          ? colors.warning
          : colors.accent;
        const justOut = state.eliminatedThisRound.includes(i);
        return (
          <View
            key={i}
            style={[styles.row, p.eliminated && !justOut && styles.faded]}
          >
            <View style={styles.rowTop}>
              <Text style={[styles.cell, styles.nameCol]} numberOfLines={1}>
                {state.roundWinner === i ? '★ ' : ''}
                {p.name}
                {p.isHuman ? ' (you)' : ''}
                {justOut ? '  — OUT' : ''}
              </Text>
              <Text style={styles.cell}>
                {p.eliminated && !justOut ? '–' : `+${p.roundPoints}`}
              </Text>
              <Text style={[styles.cell, styles.total]}>{p.totalScore}</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.bar,
                  { width: `${ratio * 100}%`, backgroundColor: barColor },
                ]}
              />
            </View>
          </View>
        );
      })}
      <Text style={styles.note}>
        {ELIMINATION_SCORE} points or more = eliminated
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: 'row', marginBottom: spacing.sm },
  header: {
    width: 56,
    textAlign: 'right',
    color: colors.textMuted,
    fontSize: font.small,
    fontWeight: '700',
  },
  nameCol: { flex: 1, textAlign: 'left' },
  row: { marginBottom: spacing.md },
  faded: { opacity: 0.4 },
  rowTop: { flexDirection: 'row', alignItems: 'center' },
  cell: {
    width: 56,
    textAlign: 'right',
    color: colors.text,
    fontSize: font.body,
  },
  total: { fontWeight: '900' },
  track: {
    height: 6,
    backgroundColor: colors.surfaceRaised,
    borderRadius: radius.pill,
    marginTop: 4,
    overflow: 'hidden',
  },
  bar: { height: 6, borderRadius: radius.pill },
  note: { color: colors.textMuted, fontSize: font.small, textAlign: 'center' },
});
