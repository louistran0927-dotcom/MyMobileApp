import type { ReactNode } from 'react';
import { StatusBar, StyleSheet, View, type ViewStyle } from 'react-native';
import { theme } from '../theme';

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export function Screen({ children, style }: Props) {
  const topInset = StatusBar.currentHeight ?? 24;
  return (
    <View style={[styles.container, { paddingTop: topInset }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
});
