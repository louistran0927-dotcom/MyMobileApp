import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KidHeader } from '../components/KidHeader';
import { ModeToggle, type LearnMode } from '../components/ModeToggle';
import { Quiz } from '../components/Quiz';
import { Screen } from '../components/Screen';
import { NUMBERS, type NumberInfo } from '../data/numbers';
import { buildNumbersQuiz } from '../data/quiz';
import { theme } from '../theme';

export function NumbersScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<NumberInfo | null>(null);
  const [mode, setMode] = useState<LearnMode>('learn');
  const questions = useMemo(() => buildNumbersQuiz(), []);

  return (
    <Screen>
      <KidHeader title="Numbers" onBack={onBack} />
      <ModeToggle mode={mode} onChange={setMode} />
      {mode === 'quiz' ? (
        <Quiz questions={questions} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {selected && (
            <View testID="number-detail" style={styles.detail}>
              <Text style={styles.detailNumber}>{selected.value}</Text>
              <Text testID="count-visual" style={styles.detailEmojis}>
                {selected.emoji.repeat(selected.value)}
              </Text>
              <Text style={styles.detailWord}>{selected.word}</Text>
            </View>
          )}
          <View style={styles.grid}>
            {NUMBERS.map(item => (
              <Pressable
                key={item.value}
                testID={`number-${item.value}`}
                accessibilityRole="button"
                accessibilityLabel={`Number ${item.value}`}
                onPress={() => setSelected(item)}
                style={({ pressed }) => [
                  styles.cell,
                  selected?.value === item.value && styles.cellSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.cellNumber}>{item.value}</Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  detail: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    alignItems: 'center',
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  detailNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: theme.colors.teal,
  },
  detailEmojis: {
    fontSize: 32,
    marginTop: theme.spacing.sm,
    flexWrap: 'wrap',
    textAlign: 'center',
  },
  detailWord: {
    fontSize: theme.font.heading,
    fontWeight: '700',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  cell: {
    width: '18%',
    aspectRatio: 1,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cellSelected: {
    backgroundColor: theme.colors.yellow,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  cellNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: theme.colors.text,
  },
});
