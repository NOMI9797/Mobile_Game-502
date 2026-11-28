/**
 * App.tsx
 * Root component. Holds which screen is showing (home → room → game) and the
 * chosen players. A simple state switch is enough for three screens, so no
 * navigation library is needed.
 *
 * @format
 */
import React, { useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';
import { PlayerSetup } from './src/engine';
import GameScreen from './src/screens/GameScreen';
import HomeScreen from './src/screens/HomeScreen';
import RoomScreen from './src/screens/RoomScreen';
import { colors } from './src/theme';

type Screen = 'home' | 'room' | 'game';

function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [setups, setSetups] = useState<PlayerSetup[]>([]);
  // Changing the key remounts GameScreen → a completely fresh game.
  const [gameKey, setGameKey] = useState(0);

  const startGame = (players: PlayerSetup[]) => {
    setSetups(players);
    setGameKey(k => k + 1);
    setScreen('game');
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" />
      <View style={styles.root}>
        <ErrorBoundary onReset={() => setScreen('home')}>
          {screen === 'home' && (
            <SafeAreaView style={styles.root}>
              <HomeScreen onCreateRoom={() => setScreen('room')} />
            </SafeAreaView>
          )}
          {screen === 'room' && (
            <SafeAreaView style={styles.root}>
              <RoomScreen
                onStart={startGame}
                onBack={() => setScreen('home')}
              />
            </SafeAreaView>
          )}
          {screen === 'game' && (
            <GameScreen
              key={gameKey}
              setups={setups}
              onExit={() => setScreen('home')}
            />
          )}
        </ErrorBoundary>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});

export default App;
