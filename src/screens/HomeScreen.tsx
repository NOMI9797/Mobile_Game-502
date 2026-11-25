/**
 * HomeScreen.tsx
 * First screen: animated Lottie card fan, game title and the Play button.
 */
import LottieView from 'lottie-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import { colors, font, spacing } from '../theme';

interface Props {
  onPlay: () => void;
}

export default function HomeScreen({ onPlay }: Props) {
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

      <Animated.View style={[styles.buttons, { opacity: enter }]}>
        <AppButton title="PLAY" onPress={onPlay} />
      </Animated.View>
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
  lottie: { width: 280, height: 280 },
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
  buttons: { width: '100%', maxWidth: 360, marginTop: spacing.xxl },
});
