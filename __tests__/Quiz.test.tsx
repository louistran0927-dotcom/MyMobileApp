import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Quiz, type QuizQuestion } from '../src/components/Quiz';

const QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    prompt: 'Find the letter B',
    options: [
      { id: 'A', label: 'A' },
      { id: 'B', label: 'B' },
      { id: 'C', label: 'C' },
    ],
    answerId: 'B',
  },
  {
    id: 'q2',
    prompt: 'Find the letter D',
    options: [
      { id: 'C', label: 'C' },
      { id: 'D', label: 'D' },
      { id: 'E', label: 'E' },
    ],
    answerId: 'D',
  },
];

describe('Quiz', () => {
  it('shows the first question prompt and its options', async () => {
    const { getByTestId } = await render(<Quiz questions={QUESTIONS} />);
    expect(getByTestId('quiz-prompt')).toHaveTextContent('Find the letter B');
    expect(getByTestId('quiz-option-A')).toBeTruthy();
    expect(getByTestId('quiz-option-B')).toBeTruthy();
    expect(getByTestId('quiz-option-C')).toBeTruthy();
  });

  it('celebrates a correct answer and locks the question', async () => {
    const { getByTestId } = await render(<Quiz questions={QUESTIONS} />);
    await fireEvent.press(getByTestId('quiz-option-B'));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
    await fireEvent.press(getByTestId('quiz-option-A'));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
  });

  it('asks to try again after a wrong answer without advancing', async () => {
    const { getByTestId } = await render(<Quiz questions={QUESTIONS} />);
    await fireEvent.press(getByTestId('quiz-option-A'));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Try again!/);
    expect(getByTestId('quiz-prompt')).toHaveTextContent('Find the letter B');
  });

  it('advances to the next question after pressing Next', async () => {
    const { getByTestId } = await render(<Quiz questions={QUESTIONS} />);
    await fireEvent.press(getByTestId('quiz-option-B'));
    await fireEvent.press(getByTestId('quiz-next'));
    expect(getByTestId('quiz-prompt')).toHaveTextContent('Find the letter D');
  });

  it('scores first-try correct answers and can be replayed', async () => {
    const { getByTestId, queryByTestId } = await render(
      <Quiz questions={QUESTIONS} />,
    );
    await fireEvent.press(getByTestId('quiz-option-A'));
    await fireEvent.press(getByTestId('quiz-option-B'));
    await fireEvent.press(getByTestId('quiz-next'));
    await fireEvent.press(getByTestId('quiz-option-D'));
    await fireEvent.press(getByTestId('quiz-next'));
    expect(getByTestId('quiz-result')).toHaveTextContent(/1 out of 2/);
    await fireEvent.press(getByTestId('quiz-restart'));
    expect(getByTestId('quiz-prompt')).toHaveTextContent('Find the letter B');
    expect(queryByTestId('quiz-result')).toBeNull();
  });
});
