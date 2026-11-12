import { Pressable, StyleSheet, Text, View } from 'react-native';
import { theme } from '../theme';

type Props = {
  title: string;
  onBack: () => void;
};

export function KidHeader({ title, onBack }: Props) {
  return (
    <View style={styles.row}>
      <Pressable
        testID="back-button"
        accessibilityRole="button"
        accessibilityLabel="Go back"
        onPress={onBack}
        hitSlop={16}
        style={styles.back}>
        <Text style={styles.backIcon}>‹</Text>
      </Pressable>
      <Text testID="screen-title" style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  back: {
    width: 56,
    height: 56,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.textMuted,
  },
  backIcon: {
    fontSize: 38,
    lineHeight: 42,
    fontWeight: '900',
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.font.heading,
    fontWeight: '900',
    color: theme.colors.text,
  },
});
