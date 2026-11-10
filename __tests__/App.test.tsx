import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import App from '../App';

describe('App counter', () => {
  it('renders initial count 0', async () => {
    const { getByTestId } = await render(<App />);
    expect(getByTestId('count')).toHaveTextContent('0');
  });

  it('increments count', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('increment'));
    expect(getByTestId('count')).toHaveTextContent('1');
  });

  it('decrements count', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('decrement'));
    expect(getByTestId('count')).toHaveTextContent('-1');
  });

  it('resets count', async () => {
    const { getByTestId } = await render(<App />);
    await fireEvent.press(getByTestId('increment'));
    await fireEvent.press(getByTestId('increment'));
    await fireEvent.press(getByTestId('reset'));
    expect(getByTestId('count')).toHaveTextContent('0');
  });
});
