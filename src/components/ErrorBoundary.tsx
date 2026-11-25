/**
 * ErrorBoundary.tsx
 * Safety net: if any screen throws an unexpected error while rendering,
 * show a friendly message with a "Back to menu" button instead of crashing.
 * (Error boundaries must be class components in React.)
 */
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, spacing } from '../theme';
import AppButton from './AppButton';

interface Props {
  children: React.ReactNode;
  onReset: () => void;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Unexpected error:', error.message);
  }

  reset = () => {
    this.setState({ hasError: false });
    this.props.onReset();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Something went wrong</Text>
        <Text style={styles.text}>The game hit an unexpected problem.</Text>
        <AppButton title="Back to menu" onPress={this.reset} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  title: { color: colors.text, fontSize: font.title, fontWeight: '800' },
  text: { color: colors.textMuted, marginVertical: spacing.lg },
});
