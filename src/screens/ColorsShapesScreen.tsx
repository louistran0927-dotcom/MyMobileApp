import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { KidHeader } from '../components/KidHeader';
import { ModeToggle, type LearnMode } from '../components/ModeToggle';
import { Quiz } from '../components/Quiz';
import { Screen } from '../components/Screen';
import { COLORS, type ColorInfo } from '../data/colors';
import { buildColorsQuiz, buildShapesQuiz } from '../data/quiz';
import { SHAPES, type ShapeInfo } from '../data/shapes';
import { speak } from '../speech';
import { theme } from '../theme';

type Tab = 'colors' | 'shapes';

export function ColorsShapesScreen({ onBack }: { onBack: () => void }) {
  const [mode, setMode] = useState<LearnMode>('learn');
  const [tab, setTab] = useState<Tab>('colors');
  const colorQuestions = useMemo(() => buildColorsQuiz(), []);
  const shapeQuestions = useMemo(() => buildShapesQuiz(), []);

  return (
    <Screen>
      <KidHeader title="Colors & Shapes" onBack={onBack} />
      <ModeToggle mode={mode} onChange={setMode} />
      <View style={styles.tabs}>
        <Pressable
          testID="tab-colors"
          accessibilityRole="button"
          accessibilityLabel="Colors"
          onPress={() => setTab('colors')}
          style={({ pressed }) => [
            styles.tabButton,
            tab === 'colors' && styles.tabButtonActive,
            pressed && styles.pressed,
          ]}>
          <Text
            style={[
              styles.tabText,
              tab === 'colors' && styles.tabTextActive,
            ]}>
            Colors 🎨
          </Text>
        </Pressable>
        <Pressable
          testID="tab-shapes"
          accessibilityRole="button"
          accessibilityLabel="Shapes"
          onPress={() => setTab('shapes')}
          style={({ pressed }) => [
            styles.tabButton,
            tab === 'shapes' && styles.tabButtonActive,
            pressed && styles.pressed,
          ]}>
          <Text
            style={[
              styles.tabText,
              tab === 'shapes' && styles.tabTextActive,
            ]}>
            Shapes 🔷
          </Text>
        </Pressable>
      </View>
      {mode === 'quiz' ? (
        <Quiz
          key={tab}
          questions={tab === 'colors' ? colorQuestions : shapeQuestions}
        />
      ) : tab === 'colors' ? (
        <ColorsLearn />
      ) : (
        <ShapesLearn />
      )}
    </Screen>
  );
}

function ColorsLearn() {
  const [selected, setSelected] = useState<ColorInfo | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {selected && (
        <View style={styles.detail}>
          <View
            testID="color-detail-swatch"
            style={[
              styles.detailSwatch,
              { backgroundColor: selected.hex },
              selected.hex === '#FFFFFF' && styles.swatchBorder,
            ]}
          />
          <Text testID="color-detail" style={styles.detailName}>
            {selected.name}
          </Text>
          <Text testID="color-detail-emoji" style={styles.detailEmoji}>
            {selected.emoji}
          </Text>
        </View>
      )}
      <View style={styles.grid}>
        {COLORS.map(color => (
          <Pressable
            key={color.name}
            testID={`color-${color.name}`}
            accessibilityRole="button"
            accessibilityLabel={color.name}
            onPress={() => {
              setSelected(color);
              speak(color.name);
            }}
            style={({ pressed }) => [
              styles.cell,
              pressed && styles.pressed,
            ]}>
            <View
              style={[
                styles.swatch,
                { backgroundColor: color.hex },
                color.hex === '#FFFFFF' && styles.swatchBorder,
              ]}
            />
            <Text style={styles.cellLabel}>{color.name}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

function ShapesLearn() {
  const [selected, setSelected] = useState<ShapeInfo | null>(null);

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {selected && (
        <View style={styles.detail}>
          <Text style={styles.detailEmojiBig}>{selected.emoji}</Text>
          <Text testID="shape-detail" style={styles.detailName}>
            {selected.name}
          </Text>
        </View>
      )}
      <View style={styles.grid}>
        {SHAPES.map(shape => (
          <Pressable
            key={shape.name}
            testID={`shape-${shape.name}`}
            accessibilityRole="button"
            accessibilityLabel={shape.name}
            onPress={() => {
              setSelected(shape);
              speak(shape.name);
            }}
            style={({ pressed }) => [styles.cell, pressed && styles.pressed]}>
            <Text style={styles.cellEmoji}>{shape.emoji}</Text>
            <Text style={styles.cellLabel}>{shape.name}</Text>
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  tabButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: theme.radius.pill,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabButtonActive: {
    backgroundColor: theme.colors.teal,
  },
  tabText: {
    fontSize: theme.font.body,
    fontWeight: '800',
    color: theme.colors.text,
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
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
  detailSwatch: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  detailEmojiBig: {
    fontSize: 96,
  },
  detailName: {
    fontSize: theme.font.heading,
    fontWeight: '900',
    color: theme.colors.text,
    marginTop: theme.spacing.sm,
  },
  detailEmoji: {
    fontSize: 40,
    marginTop: theme.spacing.xs,
  },
  swatchBorder: {
    borderWidth: 2,
    borderColor: '#E0D5C0',
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
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  cellEmoji: {
    fontSize: 40,
  },
  cellLabel: {
    fontSize: theme.font.small,
    fontWeight: '700',
    color: theme.colors.text,
  },
  pressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
});
