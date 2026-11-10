import React from 'react';
import { NativeModules } from 'react-native';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App';

const speakMock = jest.fn();
const stopMock = jest.fn();

function installSpeechEngine(value: unknown) {
  Object.defineProperty(NativeModules, 'Speech', {
    configurable: true,
    writable: true,
    value,
  });
}

const engine = { speak: speakMock, stop: stopMock };

describe('spoken audio', () => {
  beforeEach(() => {
    speakMock.mockClear();
    stopMock.mockClear();
    installSpeechEngine(engine);
  });

  it('speaks the letter and its word when a letter is tapped', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    await fireEvent.press(getByTestId('letter-B'));
    expect(speakMock).toHaveBeenCalledWith('B is for Ball');
  });

  it('speaks the number word when a number is tapped', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-numbers'));
    await fireEvent.press(getByTestId('number-5'));
    expect(speakMock).toHaveBeenCalledWith('Five');
  });

  it('speaks the animal and its sound when an animal is tapped', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-animals'));
    await fireEvent.press(getByTestId('animal-Cat'));
    expect(speakMock).toHaveBeenCalledWith('Cat says Meow');
  });

  it('speaks the quiz prompt and the encouragement', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    await fireEvent.press(getByTestId('mode-quiz'));
    const prompt = String(getByTestId('quiz-prompt').props.children);
    expect(speakMock).toHaveBeenCalledWith(prompt);
    const letter = prompt.replace('Find the letter ', '').trim();
    await fireEvent.press(getByTestId(`quiz-option-${letter}`));
    expect(speakMock).toHaveBeenCalledWith('Great job!');
  });

  it('replays the prompt when the speaker button is pressed', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    await fireEvent.press(getByTestId('mode-quiz'));
    speakMock.mockClear();
    await fireEvent.press(getByTestId('quiz-speak'));
    const prompt = String(getByTestId('quiz-prompt').props.children);
    expect(speakMock).toHaveBeenCalledWith(prompt);
  });

  it('stays silent without a speech engine', async () => {
    installSpeechEngine(undefined);
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('tool-alphabet'));
    await fireEvent.press(getByTestId('letter-B'));
    expect(speakMock).not.toHaveBeenCalled();
  });
});
