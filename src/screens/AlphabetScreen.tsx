import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KidHeader } from '../components/KidHeader';
import { ModeToggle, type LearnMode } from '../components/ModeToggle';
import { Quiz } from '../components/Quiz';
import { Screen } from '../components/Screen';
import { ALPHABET, type LetterInfo } from '../data/alphabet';
import { buildAlphabetQuiz } from '../data/quiz';
import { speak } from '../speech';
import { theme } from '../theme';

export function AlphabetScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<LetterInfo | null>(null);
  const [mode, setMode] = useState<LearnMode>('learn');
  const questions = useMemo(() => buildAlphabetQuiz(), []);

  return (
    <Screen>
      <KidHeader title="Alphabet" onBack={onBack} />
      <ModeToggle mode={mode} onChange={setMode} />
      {mode === 'quiz' ? (
        <Quiz questions={questions} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {selected && (
            <View testID="letter-detail" style={styles.detail}>
              <Text style={styles.detailEmoji}>{selected.emoji}</Text>
              <View style={styles.detailLetters}>
                <Text style={styles.detailLetter}>{selected.letter}</Text>
                <Text style={styles.detailLower}>
                  {selected.letter.toLowerCase()}
                </Text>
              </View>
              <Text style={styles.detailWord}>
                {`${selected.letter} is for ${selected.word}`}
              </Text>
            </View>
          )}
          <View style={styles.grid}>
            {ALPHABET.map(item => (
              <Pressable
                key={item.letter}
                testID={`letter-${item.letter}`}
                accessibilityRole="button"
                accessibilityLabel={`Letter ${item.letter}`}
                onPress={() => {
                  setSelected(item);
                  speak(`${item.letter} is for ${item.word}`);
                }}
                style={({ pressed }) => [
                  styles.cell,
                  selected?.letter === item.letter && styles.cellSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.cellLetter}>{item.letter}</Text>
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
  detailEmoji: {
    fontSize: 72,
  },
  detailLetters: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: theme.spacing.md,
    marginTop: theme.spacing.sm,
  },
  detailLetter: {
    fontSize: 64,
    fontWeight: '900',
    color: theme.colors.primary,
  },
  detailLower: {
    fontSize: 44,
    fontWeight: '700',
    color: theme.colors.textMuted,
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
    width: '23%',
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
  cellLetter: {
    fontSize: 26,
    fontWeight: '800',
    color: theme.colors.text,
  },
});
