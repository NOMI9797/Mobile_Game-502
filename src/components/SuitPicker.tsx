/**
 * SuitPicker.tsx
 * Pop-up shown when you play a Jack: choose the suit the next player must follow.
 */
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { SUITS, SUIT_NAME, SUIT_SYMBOL, Suit } from '../engine';
import { colors, font, radius, spacing } from '../theme';
import AppButton from './AppButton';

interface Props {
  visible: boolean;
  onPick: (suit: Suit) => void;
  onCancel: () => void;
}

export default function SuitPicker({ visible, onPick, onCancel }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Jack played – name a suit</Text>
          <View style={styles.grid}>
            {SUITS.map(suit => {
              const red = suit === 'H' || suit === 'D';
              return (
                <Pressable
                  key={suit}
                  onPress={() => onPick(suit)}
                  accessibilityRole="button"
                  accessibilityLabel={SUIT_NAME[suit]}
                  style={({ pressed }) => [
                    styles.suit,
                    pressed && styles.pressed,
                  ]}
                >
                  <Text
                    style={[
                      styles.symbol,
                      { color: red ? colors.suitRed : colors.suitBlack },
                    ]}
                  >
                    {SUIT_SYMBOL[suit]}
                  </Text>
                  <Text style={styles.suitName}>{SUIT_NAME[suit]}</Text>
                </Pressable>
              );
            })}
          </View>
          <AppButton title="Cancel" variant="secondary" onPress={onCancel} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  suit: {
    width: '48%',
    aspectRatio: 1.3,
    backgroundColor: colors.cardFace,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  pressed: { transform: [{ scale: 0.95 }], opacity: 0.8 },
  symbol: { fontSize: 40 },
  suitName: { color: colors.suitBlack, fontWeight: '700' },
});
