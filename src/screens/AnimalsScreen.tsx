import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KidHeader } from '../components/KidHeader';
import { ModeToggle, type LearnMode } from '../components/ModeToggle';
import { Quiz } from '../components/Quiz';
import { Screen } from '../components/Screen';
import { ANIMALS, type AnimalInfo } from '../data/animals';
import { buildAnimalsQuiz } from '../data/quiz';
import { speak } from '../speech';
import { theme } from '../theme';

export function AnimalsScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<AnimalInfo | null>(null);
  const [mode, setMode] = useState<LearnMode>('learn');
  const questions = useMemo(() => buildAnimalsQuiz(), []);

  return (
    <Screen>
      <KidHeader title="Animals" onBack={onBack} />
      <ModeToggle mode={mode} onChange={setMode} />
      {mode === 'quiz' ? (
        <Quiz questions={questions} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {selected && (
            <View style={styles.detail}>
              <Text style={styles.detailEmoji}>{selected.emoji}</Text>
              <Text testID="animal-detail" style={styles.detailName}>
                {selected.name}
              </Text>
              <Text testID="animal-detail-sound" style={styles.detailSound}>
                {`${selected.name} says "${selected.sound}"!`}
              </Text>
            </View>
          )}
          <View style={styles.grid}>
            {ANIMALS.map(animal => (
              <Pressable
                key={animal.name}
                testID={`animal-${animal.name}`}
                accessibilityRole="button"
                accessibilityLabel={animal.name}
                onPress={() => {
                  setSelected(animal);
                  speak(`${animal.name} says ${animal.sound}`);
                }}
                style={({ pressed }) => [
                  styles.cell,
                  selected?.name === animal.name && styles.cellSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.cellEmoji}>{animal.emoji}</Text>
                <Text style={styles.cellLabel}>{animal.name}</Text>
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
    fontSize: 80,
  },
  detailName: {
    fontSize: theme.font.heading,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  detailSound: {
    fontSize: theme.font.body,
    fontWeight: '700',
    color: theme.colors.orange,
    marginTop: theme.spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  cell: {
    width: '31%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  cellSelected: {
    backgroundColor: theme.colors.yellow,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  cellEmoji: {
    fontSize: 40,
  },
  cellLabel: {
    fontSize: theme.font.small,
    fontWeight: '700',
    color: theme.colors.text,
  },
});
