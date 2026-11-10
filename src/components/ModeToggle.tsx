import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

export type LearnMode = 'learn' | 'quiz';

type Props = {
  mode: LearnMode;
  onChange: (mode: LearnMode) => void;
};

export function ModeToggle({ mode, onChange }: Props) {
  return (
    <View style={styles.modes}>
      <Pressable
        testID="mode-learn"
        accessibilityRole="button"
        accessibilityLabel="Learn mode"
        onPress={() => onChange('learn')}
        style={({ pressed }) => [
          styles.modeButton,
          mode === 'learn' && styles.modeButtonActive,
          pressed && styles.pressed,
        ]}>
        <Text
          style={[styles.modeText, mode === 'learn' && styles.modeTextActive]}>
          Learn 📖
        </Text>
      </Pressable>
      <Pressable
        testID="mode-quiz"
        accessibilityRole="button"
        accessibilityLabel="Quiz mode"
        onPress={() => onChange('quiz')}
        style={({ pressed }) => [
          styles.modeButton,
          mode === 'quiz' && styles.modeButtonActive,
          pressed && styles.pressed,
        ]}>
        <Text
          style={[styles.modeText, mode === 'quiz' && styles.modeTextActive]}>
          Quiz ⭐
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  modes: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  modeButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modeButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  modeText: {
    fontSize: theme.font.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  modeTextActive: {
    color: '#FFFFFF',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
});
