import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../components/Screen';
import { ToolCard } from '../components/ToolCard';
import { theme } from '../theme';

export type ToolId = 'alphabet' | 'numbers' | 'colors' | 'animals';

type Tool = {
  id: ToolId;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
};

const TOOLS: Tool[] = [
  {
    id: 'alphabet',
    emoji: '🔤',
    title: 'Alphabet',
    subtitle: 'Learn A to Z',
    color: theme.colors.purple,
  },
  {
    id: 'numbers',
    emoji: '🔢',
    title: 'Numbers',
    subtitle: 'Count 1 to 20',
    color: theme.colors.teal,
  },
  {
    id: 'colors',
    emoji: '🎨',
    title: 'Colors & Shapes',
    subtitle: 'Red, blue, circles!',
    color: theme.colors.pink,
  },
  {
    id: 'animals',
    emoji: '🦁',
    title: 'Animals',
    subtitle: 'Meet friendly animals',
    color: theme.colors.orange,
  },
];

export function HomeScreen({
  onSelect,
}: {
  onSelect: (tool: ToolId) => void;
}) {
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text testID="home-title" style={styles.title}>
          Kids Learning
        </Text>
        <Text style={styles.subtitle}>Tap a game to start! 🎈</Text>
        <View style={styles.grid}>
          {TOOLS.map(tool => (
            <ToolCard
              key={tool.id}
              testID={`tool-${tool.id}`}
              emoji={tool.emoji}
              title={tool.title}
              subtitle={tool.subtitle}
              color={tool.color}
              onPress={() => onSelect(tool.id)}
            />
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.font.title,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.font.body,
    color: theme.colors.textMuted,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
