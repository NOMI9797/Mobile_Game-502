/**
 * AppButton.tsx
 * The app's standard button: shrinks slightly while pressed (Animated spring),
 * supports primary / secondary / danger styles and a disabled state.
 */
import React, { useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import { colors, font, radius, spacing } from '../theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'warning';

interface Props {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  /** "small" = compact pill for toolbars */
  size?: 'normal' | 'small';
  style?: StyleProp<ViewStyle>;
}

export default function AppButton({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  size = 'normal',
  style,
}: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const springTo = (value: number) =>
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
    }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={onPress}
        onPressIn={() => springTo(0.95)}
        onPressOut={() => springTo(1)}
        style={[
          styles.base,
          size === 'small' && styles.small,
          styles[variant],
          disabled && styles.disabled,
        ]}
      >
        <Text
          style={[
            styles.text,
            size === 'small' && styles.textSmall,
            variant === 'secondary' && styles.textLight,
          ]}
        >
          {title}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: { backgroundColor: colors.accent },
  secondary: {
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: { backgroundColor: colors.danger },
  warning: { backgroundColor: colors.warning },
  small: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
  disabled: { opacity: 0.4 },
  text: {
    color: colors.background,
    fontSize: font.body,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  textSmall: { fontSize: font.small + 1 },
  textLight: { color: colors.text },
});
