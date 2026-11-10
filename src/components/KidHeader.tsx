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
        hitSlop={12}
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
    paddingVertical: theme.spacing.sm,
    gap: theme.spacing.sm,
  },
  back: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.sm,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 30,
    lineHeight: 34,
    fontWeight: '700',
    color: theme.colors.text,
  },
  title: {
    fontSize: theme.font.heading,
    fontWeight: '800',
    color: theme.colors.text,
  },
});
