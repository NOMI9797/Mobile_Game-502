/**
 * SetupScreen.tsx
 * Choose your name and how many bots (1–5) to play against.
 */
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AppButton from '../components/AppButton';
import { PlayerSetup } from '../engine';
import { BOT_NAMES, colors, font, radius, spacing } from '../theme';

const MAX_NAME_LENGTH = 12;

interface Props {
  onStart: (players: PlayerSetup[]) => void;
  onBack: () => void;
}

export default function SetupScreen({ onStart, onBack }: Props) {
  const [name, setName] = useState('');
  const [botCount, setBotCount] = useState(3);

  const start = () => {
    // Empty or whitespace-only names fall back to "You".
    const cleanName = name.trim().slice(0, MAX_NAME_LENGTH) || 'You';
    const players: PlayerSetup[] = [
      { name: cleanName, isHuman: true },
      ...BOT_NAMES.slice(0, botCount).map(botName => ({
        name: botName,
        isHuman: false,
      })),
    ];
    onStart(players);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>New game</Text>

        <Text style={styles.label}>Your name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="You"
          placeholderTextColor={colors.textMuted}
          maxLength={MAX_NAME_LENGTH}
          style={styles.input}
          returnKeyType="done"
        />

        <Text style={styles.label}>Opponents</Text>
        <View style={styles.chips}>
          {[1, 2, 3, 4, 5].map(n => (
            <Pressable
              key={n}
              onPress={() => setBotCount(n)}
              accessibilityRole="button"
              accessibilityState={{ selected: botCount === n }}
              style={[styles.chip, botCount === n && styles.chipActive]}
            >
              <Text
                style={[
                  styles.chipText,
                  botCount === n && styles.chipTextActive,
                ]}
              >
                {n}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.preview}>
          {BOT_NAMES.slice(0, botCount).map(bot => (
            <View key={bot} style={styles.bot}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{bot[0]}</Text>
              </View>
              <Text style={styles.botName}>{bot}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.hint}>{botCount + 1} players · 7 cards each</Text>

        <AppButton title="Deal cards" onPress={start} style={styles.button} />
        <AppButton title="Back" variant="secondary" onPress={onBack} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingTop: spacing.xxl },
  title: {
    color: colors.text,
    fontSize: font.heading,
    fontWeight: '900',
    marginBottom: spacing.xl,
  },
  label: {
    color: colors.textMuted,
    fontWeight: '700',
    marginBottom: spacing.sm,
    marginTop: spacing.lg,
  },
  input: {
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: font.body,
  },
  chips: { flexDirection: 'row', justifyContent: 'space-between' },
  chip: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent },
  chipText: { color: colors.text, fontSize: font.title, fontWeight: '800' },
  chipTextActive: { color: colors.background },
  preview: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.xl,
    justifyContent: 'center',
  },
  bot: { alignItems: 'center', margin: spacing.sm },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surfaceRaised,
    borderWidth: 1,
    borderColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.accent, fontWeight: '900', fontSize: font.title },
  botName: { color: colors.text, marginTop: 4, fontSize: font.small },
  hint: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm },
  button: { marginTop: spacing.xxl, marginBottom: spacing.md },
});
