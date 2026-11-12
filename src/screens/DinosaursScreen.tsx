import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KidHeader } from '../components/KidHeader';
import { ModeToggle, type LearnMode } from '../components/ModeToggle';
import { Quiz } from '../components/Quiz';
import { Screen } from '../components/Screen';
import { DINOSAURS, type DinosaurInfo } from '../data/dinosaurs';
import { buildDinosaursQuiz } from '../data/quiz';
import { speak } from '../speech';
import { theme } from '../theme';

export function DinosaursScreen({ onBack }: { onBack: () => void }) {
  const [selected, setSelected] = useState<DinosaurInfo | null>(null);
  const [mode, setMode] = useState<LearnMode>('learn');
  const questions = useMemo(() => buildDinosaursQuiz(), []);

  return (
    <Screen>
      <KidHeader title="Dinosaurs" onBack={onBack} />
      <ModeToggle mode={mode} onChange={setMode} />
      {mode === 'quiz' ? (
        <Quiz questions={questions} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {selected && (
            <View testID="dinosaur-detail" style={styles.detail}>
              <Text style={styles.detailEmoji}>{selected.emoji}</Text>
              <Text testID="dinosaur-detail-name" style={styles.detailName}>
                {selected.name}
              </Text>
              <Text testID="dinosaur-detail-fact" style={styles.detailFact}>
                {`A ${selected.name} ${selected.fact}`}
              </Text>
              <Text style={styles.detailPeriod}>
                {`${selected.period} • ${selected.diet}`}
              </Text>
              <Text testID="dinosaur-detail-sound" style={styles.detailSound}>
                {'It goes "' + selected.sound + '"!'}
              </Text>
            </View>
          )}
          <View style={styles.grid}>
            {DINOSAURS.map(dino => (
              <Pressable
                key={dino.name}
                testID={`dinosaur-${dino.name.replace(' ', '-')}`}
                accessibilityRole="button"
                accessibilityLabel={dino.name}
                onPress={() => {
                  setSelected(dino);
                  speak(`${dino.name}. ${dino.fact}`);
                }}
                style={({ pressed }) => [
                  styles.cell,
                  selected?.name === dino.name && styles.cellSelected,
                  pressed && styles.pressed,
                ]}>
                <Text style={styles.cellEmoji}>{dino.emoji}</Text>
                <Text style={styles.cellLabel}>{dino.name}</Text>
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
  detailFact: {
    fontSize: theme.font.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  detailPeriod: {
    fontSize: theme.font.small,
    fontWeight: '700',
    color: theme.colors.textMuted,
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
  },
  cell: {
    width: '31%',
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
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
