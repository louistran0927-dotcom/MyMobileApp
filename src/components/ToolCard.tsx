import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Props = {
  testID: string;
  emoji: string;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
};

export function ToolCard({
  testID,
  emoji,
  title,
  subtitle,
  color,
  onPress,
}: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: color },
        pressed && styles.pressed,
      ]}>
      <View style={styles.emojiWrap}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
    marginBottom: theme.spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.96 }],
  },
  emojiWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.sm,
  },
  emoji: {
    fontSize: 44,
  },
  title: {
    fontSize: theme.font.heading,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: theme.font.small,
    color: 'rgba(255,255,255,0.95)',
    marginTop: 4,
    textAlign: 'center',
  },
});
