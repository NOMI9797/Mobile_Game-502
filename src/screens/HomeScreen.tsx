/**
 * HomeScreen.tsx
 * First screen: animated Lottie card fan, game title and the "Play 502" card
 * with Create Room and How to play.
 */
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import HowToPlayModal from '../components/HowToPlayModal';
import { colors, font, radius, spacing } from '../theme';

interface Props {
  onCreateRoom: () => void;
}

export default function HomeScreen({ onCreateRoom }: Props) {
  const [showHelp, setShowHelp] = useState(false);
  // Fade + slide the text in when the screen opens.
  const enter = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(enter, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [enter]);

  const translateY = enter.interpolate({
    inputRange: [0, 1],
    outputRange: [30, 0],
  });

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/card-fan.json')}
        autoPlay
        loop
        style={styles.lottie}
      />
      <Animated.View
        style={[
          styles.textBlock,
          { opacity: enter, transform: [{ translateY }] },
        ]}
      >
        <Text style={styles.title}>502</Text>
        <Text style={styles.tagline}>Shed your cards. Stay under 502.</Text>
        <Text style={styles.small}>
          Last player standing wins · 2–6 players vs bots
        </Text>
      </Animated.View>

      <Animated.View style={[styles.card, { opacity: enter }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Play 502</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VS AI BOTS</Text>
          </View>
        </View>
        <AppButton title="Create Room" icon="🃏" onPress={onCreateRoom} />
        <AppButton
          title="How to play"
          icon="📖"
          variant="secondary"
          onPress={() => setShowHelp(true)}
          style={styles.help}
        />
      </Animated.View>
      <HowToPlayModal visible={showHelp} onClose={() => setShowHelp(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  lottie: { width: 220, height: 220 },
  textBlock: { alignItems: 'center' },
  title: {
    color: colors.accent,
    fontSize: 84,
    fontWeight: '900',
    letterSpacing: 6,
  },
  tagline: {
    color: colors.text,
    fontSize: font.title,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  small: { color: colors.textMuted, marginTop: spacing.sm },
  card: {
    width: '100%',
    maxWidth: 380,
    marginTop: spacing.xl,
    padding: spacing.xl,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  cardTitle: { color: colors.text, fontSize: font.title, fontWeight: '900' },
  badge: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
  },
  badgeText: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  help: { marginTop: spacing.md },
});
