import { NativeModules } from 'react-native';

type SpeechEngine = {
  speak(text: string): void;
  stop(): void;
};

function getEngine(): SpeechEngine | undefined {
  return NativeModules.Speech as SpeechEngine | undefined;
}

export function canSpeak(): boolean {
  return getEngine() != null;
}

export function speak(text: string) {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return;
  }
  getEngine()?.speak(trimmed);
}

export function stopSpeaking() {
  getEngine()?.stop();
}
