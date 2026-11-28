/**
 * TurnBanner.tsx
 * The big "whose turn is it?" strip above the table.
 *  - your turn:  teal, gently pulsing, with a hint telling you what you can do
 *  - bot's turn: grey with the bot's initial ("Nova is thinking…")
 *  - you're out: red ("You are out – watching the bots")
 */
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

export type TurnMode = 'you' | 'bot' | 'out' | 'idle';

interface Props {
  mode: TurnMode;
  title: string;
  /** Who is playing (for the avatar on a bot's turn). */
  initial?: string;
  /** "What can I do?" – shown on your turn. */
  hint?: string | null;
  /** Penalty waiting for you → hint is shown in amber. */
  urgent?: boolean;
}

export default function TurnBanner({
  mode,
  title,
  initial,
  hint,
  urgent,
}: Props) {
  // Pulse while it's your turn so it's impossible to miss.
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (mode !== 'you') {
      pulse.stopAnimation();
      pulse.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [mode, pulse]);
  const scale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.04],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View
        style={[
          styles.banner,
          mode === 'you' && styles.you,
          mode === 'out' && styles.out,
          { transform: [{ scale }] },
        ]}
        accessibilityRole="header"
        accessibilityLiveRegion="polite"
      >
        {mode === 'bot' && initial ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        ) : null}
        {mode === 'you' ? <Text style={styles.icon}>👉</Text> : null}
        <Text
          style={[styles.title, mode === 'you' && styles.youTitle]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </Animated.View>
      {hint ? (
        <Text style={[styles.hint, urgent && styles.hintUrgent]}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: spacing.lg, marginTop: spacing.md },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  you: { backgroundColor: colors.accent, borderColor: colors.accent },
  out: { backgroundColor: colors.danger, borderColor: colors.danger },
  icon: { fontSize: font.title, marginRight: spacing.sm },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  avatarText: { color: colors.accent, fontWeight: '900' },
  title: { color: colors.text, fontSize: font.title, fontWeight: '900' },
  youTitle: { color: colors.background },
  hint: {
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: font.body,
    lineHeight: 20,
  },
  hintUrgent: { color: colors.warning, fontWeight: '700' },
});
