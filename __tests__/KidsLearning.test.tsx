import React from 'react';
import { act, render, fireEvent } from '@testing-library/react-native';
import { BackHandler } from 'react-native';
import App from '../App';
import { ANIMALS } from '../src/data/animals';

describe('Kids Learning app', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('shows the home screen with four learning tools', async () => {
    const { getByTestId } = await render(<App />);
    expect(getByTestId('home-title')).toHaveTextContent('Kids Learning');
    expect(getByTestId('tool-alphabet')).toBeTruthy();
    expect(getByTestId('tool-numbers')).toBeTruthy();
    expect(getByTestId('tool-colors')).toBeTruthy();
    expect(getByTestId('tool-animals')).toBeTruthy();
  });

  it('opens Alphabet and shows which word a letter belongs to', async () => {
    const { getByTestId, getByText } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    expect(getByTestId('screen-title')).toHaveTextContent('Alphabet');
    await fireEvent.press(getByTestId('letter-B'));
    expect(getByText('B is for Ball')).toBeTruthy();
  });

  it('plays the Alphabet quiz and celebrates a correct answer', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    await fireEvent.press(getByTestId('mode-quiz'));
    const prompt = String(getByTestId('quiz-prompt').props.children);
    const letter = prompt.replace('Find the letter ', '').trim();
    await fireEvent.press(getByTestId(`quiz-option-${letter}`));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
  });

  it('opens Numbers and counts objects for a tapped number', async () => {
    const { getByTestId, getByText } = await render(<App />);
    await fireEvent.press(getByTestId('tool-numbers'));
    expect(getByTestId('screen-title')).toHaveTextContent('Numbers');
    expect(getByTestId('number-20')).toBeTruthy();
    await fireEvent.press(getByTestId('number-5'));
    expect(getByText('Five')).toBeTruthy();
    expect(getByTestId('count-visual')).toHaveTextContent('🐟🐟🐟🐟🐟');
  });

  it('plays the Numbers quiz and answers a counting question', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-numbers'));
    await fireEvent.press(getByTestId('mode-quiz'));
    const visual = String(getByTestId('quiz-visual').props.children);
    const emoji = Array.from(visual)[0];
    const answer = visual.split(emoji).length - 1;
    await fireEvent.press(getByTestId(`quiz-option-${answer}`));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
  });

  it('opens Colors & Shapes and shows a color detail', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-colors'));
    expect(getByTestId('screen-title')).toHaveTextContent('Colors & Shapes');
    await fireEvent.press(getByTestId('color-Red'));
    expect(getByTestId('color-detail')).toHaveTextContent('Red');
    expect(getByTestId('color-detail-emoji')).toHaveTextContent('🍎');
  });

  it('plays the Colors quiz and taps the asked color', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-colors'));
    await fireEvent.press(getByTestId('mode-quiz'));
    const prompt = String(getByTestId('quiz-prompt').props.children);
    const name = prompt.replace('Tap the ', '').replace(' color', '');
    await fireEvent.press(getByTestId(`quiz-option-${name}`));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
  });

  it('opens Shapes and shows a shape detail', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-colors'));
    await fireEvent.press(getByTestId('tab-shapes'));
    await fireEvent.press(getByTestId('shape-Star'));
    expect(getByTestId('shape-detail')).toHaveTextContent('Star');
  });

  it('plays the Shapes quiz and taps the asked shape', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-colors'));
    await fireEvent.press(getByTestId('tab-shapes'));
    await fireEvent.press(getByTestId('mode-quiz'));
    const prompt = String(getByTestId('quiz-prompt').props.children);
    const name = prompt.replace('Tap the ', '');
    await fireEvent.press(getByTestId(`quiz-option-${name}`));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
  });

  it('opens Animals and shows the sound an animal makes', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-animals'));
    expect(getByTestId('screen-title')).toHaveTextContent('Animals');
    await fireEvent.press(getByTestId('animal-Cat'));
    expect(getByTestId('animal-detail')).toHaveTextContent('Cat');
    expect(getByTestId('animal-detail-sound')).toHaveTextContent(
      'Cat says "Meow"!',
    );
  });

  it('plays the Animals quiz and taps the animal that makes the sound', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-animals'));
    await fireEvent.press(getByTestId('mode-quiz'));
    const prompt = String(getByTestId('quiz-prompt').props.children);
    const sound = prompt
      .replace('Which animal says ', '')
      .replace('?', '')
      .trim();
    const animal = ANIMALS.find(a => a.sound === sound);
    expect(animal).toBeDefined();
    await fireEvent.press(getByTestId(`quiz-option-${animal!.name}`));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
  });

  it('shows the home screen with six learning tools', async () => {
    const { getByTestId } = await render(<App />);
    expect(getByTestId('tool-dinosaurs')).toBeTruthy();
    expect(getByTestId('tool-camera')).toBeTruthy();
  });

  it('opens Dinosaurs and shows a dinosaur detail', async () => {
    const { getByTestId, getByText } = await render(<App />);
    await fireEvent.press(getByTestId('tool-dinosaurs'));
    expect(getByTestId('screen-title')).toHaveTextContent('Dinosaurs');
    await fireEvent.press(getByTestId('dinosaur-Tyrannosaurus-Rex'));
    expect(getByTestId('dinosaur-detail-name')).toHaveTextContent(
      'Tyrannosaurus Rex',
    );
    expect(getByTestId('dinosaur-detail-fact')).toHaveTextContent(
      /banana-sized teeth/,
    );
    expect(getByTestId('dinosaur-detail-sound')).toHaveTextContent(
      'It goes "Roar!"!',
    );
  });

  it('plays the Dinosaurs quiz and taps the asked dinosaur', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-dinosaurs'));
    await fireEvent.press(getByTestId('mode-quiz'));
    const prompt = String(getByTestId('quiz-prompt').props.children);
    const name = prompt.replace('Tap the ', '');
    await fireEvent.press(getByTestId(`quiz-option-${name}`));
    expect(getByTestId('quiz-feedback')).toHaveTextContent(/Great job!/);
  });

  it('returns home from a tool with the back button', async () => {
    const { getByTestId, queryByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    expect(queryByTestId('home-title')).toBeNull();
    await fireEvent.press(getByTestId('back-button'));
    expect(getByTestId('home-title')).toHaveTextContent('Kids Learning');
  });

  it('goes home on the Android hardware back button instead of exiting', async () => {
    const handlers: Array<() => boolean> = [];
    jest.spyOn(BackHandler, 'addEventListener').mockImplementation(
      (_event, handler) => {
        handlers.push(() => Boolean(handler({} as never)));
        return { remove: jest.fn() };
      },
    );
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    expect(handlers.length).toBeGreaterThan(0);
    let handled = false;
    await act(async () => {
      handled = handlers[handlers.length - 1]();
      await Promise.resolve();
    });
    expect(handled).toBe(true);
    expect(getByTestId('home-title')).toHaveTextContent('Kids Learning');
  });
});
