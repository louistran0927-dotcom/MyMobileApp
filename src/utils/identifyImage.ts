/**
 * Image identification hook point.
 *
 * The captured photo URI is passed here. Wire a real classifier into
 * `runClassifier` (Google ML Kit image labeling, TensorFlow Lite, or a cloud
 * vision API) to identify what the camera sees. Until then this returns a
 * clear placeholder so the UI flows end-to-end.
 */
export type Identification = {
  label: string;
  confidence: number;
  /** 'placeholder' until a real classifier is connected. */
  source: 'model' | 'placeholder';
};

async function runClassifier(uri: string): Promise<Identification> {
  // TODO: replace with a real image classifier using `uri` (file:// photo path).
  return {
    label: "I'm not sure yet",
    confidence: 0,
    source: 'placeholder',
  };
}

export async function identifyImage(
  uri: string,
): Promise<Identification> {
  return runClassifier(uri);
}
