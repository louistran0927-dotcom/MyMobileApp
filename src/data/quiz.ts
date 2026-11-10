import type { QuizQuestion } from '../components/Quiz';
import { ALPHABET } from './alphabet';
import { ANIMALS } from './animals';
import { COLORS } from './colors';
import { NUMBERS } from './numbers';
import { SHAPES } from './shapes';

export const QUIZ_LENGTH = 5;

function mulberry32(seed: number) {
  /* eslint-disable no-bitwise -- mulberry32 PRNG is defined with bitwise ops */
  return function next() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  /* eslint-enable no-bitwise */
}

function shuffle<T>(items: T[], seed: number): T[] {
  const rand = mulberry32(seed);
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function buildAlphabetQuiz(
  count: number = QUIZ_LENGTH,
  seed: number = 20260110,
): QuizQuestion[] {
  const pool = shuffle(ALPHABET, seed);
  return pool.slice(0, count).map((item, i) => {
    const letterIndex = ALPHABET.indexOf(item);
    const others = ALPHABET.filter(x => x.letter !== item.letter);
    const first = others[(letterIndex + 5) % others.length];
    const second = others[(letterIndex + 11) % others.length];
    const options = [first, item, second].map(x => ({
      id: x.letter,
      label: x.letter,
    }));
    const rotation = i % options.length;
    return {
      id: `alphabet-${item.letter}`,
      prompt: `Find the letter ${item.letter}`,
      options: [
        ...options.slice(rotation),
        ...options.slice(0, rotation),
      ],
      answerId: item.letter,
    };
  });
}

export function buildNumbersQuiz(
  count: number = QUIZ_LENGTH,
  seed: number = 20260111,
): QuizQuestion[] {
  const pool = shuffle(
    NUMBERS.filter(n => n.value <= 10),
    seed,
  );
  return pool.slice(0, count).map((item, i) => {
    const distractors: number[] = [];
    for (const value of [item.value - 1, item.value + 1]) {
      if (
        value >= 1 &&
        value <= 10 &&
        value !== item.value &&
        !distractors.includes(value)
      ) {
        distractors.push(value);
      }
    }
    for (const other of NUMBERS) {
      if (distractors.length >= 2) {
        break;
      }
      if (!distractors.includes(other.value)) {
        distractors.push(other.value);
      }
    }
    const options = [distractors[0], item.value, distractors[1]].map(value => ({
      id: String(value),
      label: String(value),
    }));
    const rotation = i % options.length;
    return {
      id: `numbers-${item.value}`,
      prompt: `How many ${item.emoji}?`,
      spokenPrompt: `How many ${item.noun}?`,
      visual: item.emoji.repeat(item.value),
      options: [
        ...options.slice(rotation),
        ...options.slice(0, rotation),
      ],
      answerId: String(item.value),
    };
  });
}

export function buildColorsQuiz(
  count: number = QUIZ_LENGTH,
  seed: number = 20260112,
): QuizQuestion[] {
  const pool = shuffle(COLORS, seed);
  return pool.slice(0, count).map((item, i) => {
    const others = COLORS.filter(c => c.name !== item.name);
    const first = others[(i * 3 + 1) % others.length];
    const second = others[(i * 3 + 4) % others.length];
    const options = [first, item, second].map(c => ({
      id: c.name,
      label: c.name,
      color: c.hex,
    }));
    const rotation = i % options.length;
    return {
      id: `colors-${item.name}`,
      prompt: `Tap the ${item.name} color`,
      options: [
        ...options.slice(rotation),
        ...options.slice(0, rotation),
      ],
      answerId: item.name,
    };
  });
}

export function buildShapesQuiz(
  count: number = QUIZ_LENGTH,
  seed: number = 20260113,
): QuizQuestion[] {
  const pool = shuffle(SHAPES, seed);
  return pool.slice(0, count).map((item, i) => {
    const others = SHAPES.filter(s => s.name !== item.name);
    const first = others[(i * 2 + 1) % others.length];
    const second = others[(i * 2 + 3) % others.length];
    const options = [first, item, second].map(s => ({
      id: s.name,
      label: s.name,
      emoji: s.emoji,
    }));
    const rotation = i % options.length;
    return {
      id: `shapes-${item.name}`,
      prompt: `Tap the ${item.name}`,
      options: [
        ...options.slice(rotation),
        ...options.slice(0, rotation),
      ],
      answerId: item.name,
    };
  });
}

export function buildAnimalsQuiz(
  count: number = QUIZ_LENGTH,
  seed: number = 20260114,
): QuizQuestion[] {
  const pool = shuffle(ANIMALS, seed);
  return pool.slice(0, count).map((item, i) => {
    const others = ANIMALS.filter(a => a.name !== item.name);
    const first = others[(i * 3 + 1) % others.length];
    const second = others[(i * 3 + 4) % others.length];
    const options = [first, item, second].map(a => ({
      id: a.name,
      label: a.name,
      emoji: a.emoji,
    }));
    const rotation = i % options.length;
    return {
      id: `animals-${item.name}`,
      prompt: `Which animal says ${item.sound}?`,
      options: [
        ...options.slice(rotation),
        ...options.slice(0, rotation),
      ],
      answerId: item.name,
    };
  });
}
