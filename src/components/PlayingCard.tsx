/**
 * PlayingCard.tsx
 * Draws one card – face up (rank + suit) or face down (card back).
 * Playable cards are lifted with a teal border; unplayable ones are dimmed.
 */
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import { Card, SUIT_SYMBOL } from '../engine';
import { colors, radius } from '../theme';

export type CardSize = 'sm' | 'md' | 'lg';

const SIZES: Record<
  CardSize,
  { w: number; h: number; rank: number; pip: number }
> = {
  sm: { w: 34, h: 48, rank: 11, pip: 14 },
  md: { w: 62, h: 90, rank: 16, pip: 30 },
  lg: { w: 84, h: 122, rank: 20, pip: 44 },
};

interface Props {
  card?: Card; // undefined → show the back
  faceDown?: boolean;
  size?: CardSize;
  playable?: boolean;
  dimmed?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function PlayingCard({
  card,
  faceDown = false,
  size = 'md',
  playable = false,
  dimmed = false,
  onPress,
  style,
}: Props) {
  const dims = SIZES[size];

  // Lift playable cards up a little (animated so it moves smoothly).
  const lift = useRef(new Animated.Value(playable ? -10 : 0)).current;
  useEffect(() => {
    Animated.spring(lift, {
      toValue: playable ? -10 : 0,
      useNativeDriver: true,
    }).start();
  }, [playable, lift]);

  const showBack = faceDown || !card;
  const red = card && (card.suit === 'H' || card.suit === 'D');
  const suitColor = red ? colors.suitRed : colors.suitBlack;

  const body = showBack ? (
    <View style={[styles.card, styles.back, { width: dims.w, height: dims.h }]}>
      <View style={styles.backInner}>
        {size === 'sm' ? (
          <View style={styles.backDot} />
        ) : (
          <Text style={[styles.backLogo, { fontSize: dims.rank }]}>502</Text>
        )}
      </View>
      {dimmed && <View style={styles.dimOverlay} />}
    </View>
  ) : (
    <View
      style={[
        styles.card,
        styles.face,
        { width: dims.w, height: dims.h },
        playable && styles.playable,
      ]}
    >
      <Text style={[styles.rank, { color: suitColor, fontSize: dims.rank }]}>
        {card!.rank}
      </Text>
      <Text style={[styles.pip, { color: suitColor, fontSize: dims.pip }]}>
        {SUIT_SYMBOL[card!.suit]}
      </Text>
      {size !== 'sm' && (
        <Text
          style={[
            styles.rank,
            styles.rankBottom,
            { color: suitColor, fontSize: dims.rank },
          ]}
        >
          {card!.rank}
        </Text>
      )}
      {dimmed && <View style={styles.dimOverlay} />}
    </View>
  );

  return (
    <Animated.View style={[{ transform: [{ translateY: lift }] }, style]}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          accessibilityRole="button"
          accessibilityLabel={
            card ? `${card.rank} of ${card.suit}` : 'Draw pile'
          }
        >
          {body}
        </Pressable>
      ) : (
        body
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.sm,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  face: {
    backgroundColor: colors.cardFace,
    borderColor: '#D6D3CB',
    padding: 4,
    justifyContent: 'space-between',
  },
  playable: { borderColor: colors.accent, borderWidth: 3 },
  // A solid dark layer on top (not opacity), so overlapping cards never show through.
  dimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.sm - 2,
    backgroundColor: 'rgba(11, 15, 23, 0.55)',
  },
  backDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  rank: { fontWeight: '900' },
  rankBottom: { alignSelf: 'flex-end', transform: [{ rotate: '180deg' }] },
  pip: { textAlign: 'center', marginTop: -4 },
  back: {
    backgroundColor: colors.cardBack,
    borderColor: colors.accent,
    padding: 4,
  },
  backInner: {
    flex: 1,
    borderRadius: radius.sm - 3,
    borderWidth: 1,
    borderColor: colors.accentDark,
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backLogo: { color: colors.accent, fontWeight: '900' },
});
