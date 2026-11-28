/**
 * OpponentSeat.tsx
 * A bot's seat at the top of the table: avatar, name, card count and score.
 * Glows (pulsing border) when it is that bot's turn; greyed out when eliminated.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { Player } from '../engine';
import { colors, font, radius, spacing } from '../theme';
import PlayingCard from './PlayingCard';

interface Props {
  player: Player;
  isTurn: boolean;
  /** Seat width, worked out by the game screen so all seats fit on screen. */
  width: number;
}

export default function OpponentSeat({ player, isTurn, width }: Props) {
  const pulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isTurn) {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [isTurn, pulse]);

  const borderColor = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.accentDark, colors.accent],
  });

  return (
    <Animated.View
      style={[
        styles.seat,
        { width },
        isTurn && { borderColor, borderWidth: 2 },
        player.eliminated && styles.out,
      ]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{player.name[0]}</Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {player.name}
      </Text>
      {player.eliminated ? (
        <Text style={styles.outText}>OUT</Text>
      ) : (
        <View style={styles.cardsRow}>
          <PlayingCard size="sm" faceDown />
          <Text style={styles.count}>×{player.hand.length}</Text>
        </View>
      )}
      <Text style={styles.score}>{player.totalScore} pts</Text>
      {isTurn ? <Text style={styles.playing}>▶ Playing</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  seat: {
    alignItems: 'center',
    padding: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  out: { opacity: 0.35 },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.accent, fontWeight: '900' },
  name: {
    color: colors.text,
    fontSize: font.small,
    fontWeight: '700',
    marginTop: 4,
  },
  cardsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  count: { color: colors.text, marginLeft: 4, fontWeight: '800' },
  outText: { color: colors.danger, fontWeight: '900', marginTop: 8 },
  score: { color: colors.textMuted, fontSize: 11, marginTop: 4 },
  playing: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
  },
});
