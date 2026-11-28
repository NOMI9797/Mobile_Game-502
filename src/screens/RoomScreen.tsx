/**
 * RoomScreen.tsx
 * "Create Room": the table before the game starts.
 *  - a room code (just for show – everyone in the room is on this phone)
 *  - one seat per player: you (the host) and the AI bots
 *  - every name can be edited; empty names fall back to a default
 *  - add a bot (up to 5) or remove one (at least 1) → 2–6 players
 *  - two players with the same name → warning, Start is disabled
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

export const MAX_NAME_LENGTH = 12;
const MIN_BOTS = 1;
const MAX_BOTS = 5;
const DEFAULT_BOTS = 2;

interface Props {
  onStart: (players: PlayerSetup[]) => void;
  onBack: () => void;
}

interface BotSeat {
  key: number;
  /** Used when the name box is left empty. */
  defaultName: string;
  /** What the player typed ('' = use the default). */
  name: string;
}

/** Random 4-character room code, e.g. "K7QX" (no 0/O or 1/I to avoid confusion). */
function makeRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++)
    code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

/** Trim, cut to 12 letters, fall back to the default when empty. */
const cleanName = (typed: string, fallback: string) =>
  typed.trim().slice(0, MAX_NAME_LENGTH) || fallback;

export default function RoomScreen({ onStart, onBack }: Props) {
  const [roomCode] = useState(makeRoomCode);
  const [myName, setMyName] = useState('');
  const [bots, setBots] = useState<BotSeat[]>(() =>
    BOT_NAMES.slice(0, DEFAULT_BOTS).map((n, i) => ({
      key: i,
      defaultName: n,
      name: '',
    })),
  );
  const [nextKey, setNextKey] = useState(DEFAULT_BOTS);

  // ----- the final names, exactly as they will appear in the game -----
  const players: PlayerSetup[] = [
    { name: cleanName(myName, 'You'), isHuman: true },
    ...bots.map(b => ({
      name: cleanName(b.name, b.defaultName),
      isHuman: false,
    })),
  ];

  // Two players with the same name would be confusing in the game.
  const seen = new Set<string>();
  let duplicate: string | null = null;
  for (const p of players) {
    const k = p.name.toLowerCase();
    if (seen.has(k)) duplicate = p.name;
    seen.add(k);
  }

  const addBot = () => {
    if (bots.length >= MAX_BOTS) return;
    // First default name nobody is using yet.
    const used = new Set(players.map(p => p.name.toLowerCase()));
    const defaultName =
      BOT_NAMES.find(n => !used.has(n.toLowerCase())) ??
      `Bot ${bots.length + 1}`;
    setBots([...bots, { key: nextKey, defaultName, name: '' }]);
    setNextKey(nextKey + 1);
  };

  const removeBot = (key: number) => {
    if (bots.length <= MIN_BOTS) return;
    setBots(bots.filter(b => b.key !== key));
  };

  const renameBot = (key: number, name: string) =>
    setBots(bots.map(b => (b.key === key ? { ...b, name } : b)));

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Room header */}
        <View style={styles.headerRow}>
          <Text style={styles.title}>Your room</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>VS AI</Text>
          </View>
        </View>
        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>Room code</Text>
          <Text style={styles.code} testID="room-code">
            {roomCode}
          </Text>
        </View>

        <Text style={styles.label}>
          Players at the table · {players.length}/{MAX_BOTS + 1}
        </Text>

        {/* Your seat */}
        <View style={[styles.seat, styles.mySeat]}>
          <View style={[styles.avatar, styles.myAvatar]}>
            <Text style={styles.myAvatarText}>
              {players[0].name[0].toUpperCase()}
            </Text>
          </View>
          <TextInput
            testID="name-input"
            value={myName}
            onChangeText={setMyName}
            placeholder="Your name (You)"
            placeholderTextColor={colors.textMuted}
            maxLength={MAX_NAME_LENGTH}
            style={styles.input}
            returnKeyType="done"
            accessibilityLabel="Your name"
          />
          <View style={[styles.tag, styles.hostTag]}>
            <Text style={styles.hostTagText}>YOU · HOST</Text>
          </View>
        </View>

        {/* Bot seats */}
        {bots.map((b, i) => {
          const shown = players[i + 1].name;
          return (
            <View key={b.key} style={styles.seat}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>🤖</Text>
              </View>
              <TextInput
                testID={`bot-name-${i}`}
                value={b.name}
                onChangeText={t => renameBot(b.key, t)}
                placeholder={b.defaultName}
                placeholderTextColor={colors.textMuted}
                maxLength={MAX_NAME_LENGTH}
                style={styles.input}
                returnKeyType="done"
                accessibilityLabel={`Name of AI bot ${i + 1}`}
              />
              <View style={styles.tag}>
                <Text style={styles.tagText}>AI BOT</Text>
              </View>
              {bots.length > MIN_BOTS && (
                <Pressable
                  onPress={() => removeBot(b.key)}
                  accessibilityRole="button"
                  accessibilityLabel={`Remove ${shown}`}
                  hitSlop={8}
                  style={styles.remove}
                >
                  <Text style={styles.removeText}>✕</Text>
                </Pressable>
              )}
            </View>
          );
        })}

        {bots.length < MAX_BOTS && (
          <Pressable
            onPress={addBot}
            accessibilityRole="button"
            style={styles.addSeat}
          >
            <Text style={styles.addText}>+ Add AI bot</Text>
          </Pressable>
        )}

        {duplicate ? (
          <View style={styles.error} accessibilityRole="alert">
            <Text style={styles.errorText}>
              ⚠️ Each player needs a different name – "{duplicate}" is used
              twice.
            </Text>
          </View>
        ) : (
          <Text style={styles.hint}>
            Tap a name to change it · {players.length} players · 7 cards each
          </Text>
        )}

        <AppButton
          title="Start game"
          icon="🃏"
          onPress={() => onStart(players)}
          disabled={!!duplicate}
          style={styles.button}
        />
        <AppButton title="Back" variant="secondary" onPress={onBack} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: { padding: spacing.xl, paddingTop: spacing.xxl },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: { color: colors.text, fontSize: font.heading, fontWeight: '900' },
  badge: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
  },
  badgeText: { color: colors.accent, fontWeight: '900', letterSpacing: 1 },
  codeBox: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  codeLabel: { color: colors.textMuted, fontSize: font.small },
  code: {
    color: colors.text,
    fontSize: font.heading,
    fontWeight: '900',
    letterSpacing: 8,
  },
  label: {
    color: colors.textMuted,
    fontWeight: '700',
    marginTop: spacing.xl,
    marginBottom: spacing.sm,
  },
  seat: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  mySeat: { borderColor: colors.accent },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  myAvatar: { backgroundColor: colors.accent },
  myAvatarText: {
    color: colors.background,
    fontWeight: '900',
    fontSize: font.title,
  },
  avatarText: { fontSize: font.title },
  input: {
    flex: 1,
    color: colors.text,
    fontSize: font.body,
    fontWeight: '700',
    marginHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
  },
  tag: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceRaised,
  },
  tagText: { color: colors.textMuted, fontSize: 10, fontWeight: '900' },
  hostTag: { backgroundColor: colors.accentDark },
  hostTagText: { color: colors.text, fontSize: 10, fontWeight: '900' },
  remove: {
    width: 28,
    height: 28,
    marginLeft: spacing.sm,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surfaceRaised,
  },
  removeText: { color: colors.danger, fontWeight: '900' },
  addSeat: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.accent,
    alignItems: 'center',
  },
  addText: { color: colors.accent, fontWeight: '800' },
  hint: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  error: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.danger,
  },
  errorText: { color: colors.text, fontWeight: '700', textAlign: 'center' },
  button: { marginTop: spacing.xl, marginBottom: spacing.md },
});
