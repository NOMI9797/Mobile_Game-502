/**
 * MoveWarning.tsx
 * Red "Not allowed" box shown when you try a wrong move. It shakes when it
 * appears, explains WHY the move isn't allowed, and can be tapped away.
 */
import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  message: string | null;
  /** Changes on every new warning so the shake replays even for the same text. */
  id: number;
  onDismiss: () => void;
}

export default function MoveWarning({ message, id, onDismiss }: Props) {
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    shake.setValue(0);
    Animated.sequence(
      [10, -10, 8, -8, 4, 0].map(toValue =>
        Animated.timing(shake, {
          toValue,
          duration: 55,
          useNativeDriver: true,
        }),
      ),
    ).start();
  }, [id, message, shake]);

  if (!message) return null;
  return (
    <Animated.View
      style={[styles.box, { transform: [{ translateX: shake }] }]}
      accessibilityRole="alert"
      accessibilityLiveRegion="assertive"
    >
      {/* accessible={false}: the texts stay separate, so screen readers
          (and UI tests) read the warning itself, not just a button label. */}
      <Pressable onPress={onDismiss} accessible={false}>
        <Text style={styles.title}>✋ Not allowed</Text>
        <Text style={styles.text}>{message}</Text>
        <Text style={styles.dismiss}>Tap to close</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  box: {
    position: 'absolute',
    // Inside the table's bounds (iOS clips views that hang outside a
    // rounded parent), covering its lower part – right above your cards.
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
    borderWidth: 2,
    borderColor: '#FFE4E6',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
    zIndex: 10,
  },
  title: { color: colors.text, fontSize: font.title, fontWeight: '900' },
  text: {
    color: colors.text,
    fontSize: font.body,
    fontWeight: '600',
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  dismiss: {
    color: '#FFE4E6',
    fontSize: font.small,
    marginTop: spacing.xs,
    textAlign: 'right',
  },
});
