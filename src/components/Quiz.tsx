import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { speak, stopSpeaking } from '../speech';
import { theme } from '../theme';

export type QuizOption = {
  id: string;
  label: string;
  emoji?: string;
  color?: string;
};

export type QuizQuestion = {
  id: string;
  prompt: string;
  /** Spoken version of the prompt, when the visible prompt contains emoji. */
  spokenPrompt?: string;
  visual?: string;
  options: QuizOption[];
  answerId: string;
};

function isLightColor(hex: string): boolean {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
}

type Props = {
  questions: QuizQuestion[];
};

export function Quiz({ questions }: Props) {
  const [index, setIndex] = useState(0);
  const [stage, setStage] = useState<'answering' | 'correct' | 'done'>(
    'answering',
  );
  const [picked, setPicked] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [madeMistake, setMadeMistake] = useState(false);

  const question = questions[index];
  const isLast = index === questions.length - 1;
  const spokenPrompt = question.spokenPrompt ?? question.prompt;

  useEffect(() => {
    speak(spokenPrompt);
  }, [spokenPrompt]);

  useEffect(() => () => stopSpeaking(), []);

  useEffect(() => {
    if (stage === 'done') {
      speak(`You scored ${score} out of ${questions.length}`);
    }
  }, [stage, score, questions.length]);

  const pick = (optionId: string) => {
    if (stage !== 'answering') {
      return;
    }
    if (optionId === question.answerId) {
      speak('Great job!');
      if (!madeMistake) {
        setScore(s => s + 1);
      }
      setPicked(optionId);
      setStage('correct');
    } else {
      setMadeMistake(true);
      setWrongIds(ids => [...ids, optionId]);
      setPicked(optionId);
    }
  };

  const next = () => {
    if (isLast) {
      setStage('done');
      return;
    }
    setIndex(i => i + 1);
    setStage('answering');
    setPicked(null);
    setWrongIds([]);
    setMadeMistake(false);
  };

  const restart = () => {
    setIndex(0);
    setStage('answering');
    setPicked(null);
    setWrongIds([]);
    setScore(0);
    setMadeMistake(false);
  };

  if (stage === 'done') {
    return (
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.resultEmoji}>🌟</Text>
          <Text testID="quiz-result" style={styles.result}>
            {`You scored ${score} out of ${questions.length}!`}
          </Text>
          <Pressable
            testID="quiz-restart"
            accessibilityRole="button"
            accessibilityLabel="Play again"
            onPress={restart}
            style={({ pressed }) => [
              styles.restart,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.restartText}>Play again 🔁</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const showTryAgain = stage === 'answering' && picked !== null;

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.card}>
        <Text style={styles.progress}>
          {`Question ${index + 1} of ${questions.length}`}
        </Text>
        <View style={styles.promptRow}>
          <Text testID="quiz-prompt" style={styles.prompt}>
            {question.prompt}
          </Text>
          <Pressable
            testID="quiz-speak"
            accessibilityRole="button"
            accessibilityLabel="Hear the question"
            onPress={() => speak(spokenPrompt)}
            hitSlop={8}
            style={({ pressed }) => [
              styles.speakButton,
              pressed && styles.pressed,
            ]}>
            <Text style={styles.speakIcon}>🔊</Text>
          </Pressable>
        </View>
        {question.visual ? (
          <Text testID="quiz-visual" style={styles.visual}>
            {question.visual}
          </Text>
        ) : null}
        <View style={styles.options}>
          {question.options.map(option => {
            const isPicked = picked === option.id;
            const isWrong = wrongIds.includes(option.id);
            const isCorrect = isPicked && option.id === question.answerId;
            return (
              <Pressable
                key={option.id}
                testID={`quiz-option-${option.id}`}
                accessibilityRole="button"
                accessibilityLabel={option.label}
                disabled={stage === 'correct' || isWrong}
                onPress={() => pick(option.id)}
                style={({ pressed }) => [
                  styles.option,
                  option.color ? { backgroundColor: option.color } : null,
                  isCorrect && styles.optionCorrect,
                  isWrong && styles.optionWrong,
                  pressed && styles.pressed,
                ]}>
                {option.emoji ? (
                  <Text style={styles.optionEmoji}>{option.emoji}</Text>
                ) : null}
                <Text
                  style={[
                    styles.optionLabel,
                    option.color
                      ? isLightColor(option.color)
                        ? styles.optionLabelDark
                        : styles.optionLabelLight
                      : null,
                  ]}>
                  {option.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text testID="quiz-feedback" style={styles.feedback}>
          {stage === 'correct'
            ? 'Great job! 🎉'
            : showTryAgain
              ? 'Try again! 💪'
              : ''}
        </Text>
        {stage === 'correct' ? (
          <Pressable
            testID="quiz-next"
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'See my score' : 'Next question'}
            onPress={next}
            style={({ pressed }) => [styles.next, pressed && styles.pressed]}>
            <Text style={styles.nextText}>
              {isLast ? 'See my score 🌟' : 'Next ▶'}
            </Text>
          </Pressable>
        ) : null}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    alignItems: 'center',
  },
  progress: {
    fontSize: theme.font.small,
    color: theme.colors.textMuted,
    fontWeight: '700',
  },
  promptRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    width: '100%',
    marginTop: theme.spacing.xs,
  },
  prompt: {
    flex: 1,
    fontSize: theme.font.heading,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
  },
  speakButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakIcon: {
    fontSize: 22,
  },
  visual: {
    fontSize: 48,
    marginVertical: theme.spacing.md,
  },
  options: {
    width: '100%',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.md,
  },
  option: {
    minHeight: 64,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  optionCorrect: {
    backgroundColor: theme.colors.green,
  },
  optionWrong: {
    backgroundColor: theme.colors.red,
    opacity: 0.6,
  },
  optionEmoji: {
    fontSize: 32,
  },
  optionLabel: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.text,
  },
  optionLabelDark: {
    color: theme.colors.text,
  },
  optionLabelLight: {
    color: '#FFFFFF',
  },
  feedback: {
    minHeight: 32,
    fontSize: theme.font.body,
    fontWeight: '800',
    color: theme.colors.text,
    marginTop: theme.spacing.md,
  },
  next: {
    marginTop: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: theme.font.body,
    fontWeight: '800',
  },
  restart: {
    marginTop: theme.spacing.lg,
    backgroundColor: theme.colors.teal,
    borderRadius: theme.radius.pill,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.xl,
  },
  restartText: {
    color: '#FFFFFF',
    fontSize: theme.font.body,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  resultEmoji: {
    fontSize: 64,
  },
  result: {
    fontSize: theme.font.heading,
    fontWeight: '900',
    color: theme.colors.text,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
  },
});
