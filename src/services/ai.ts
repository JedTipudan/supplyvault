// AI recognition provider architecture. Never auto-creates records.
// Flow: Camera/Image -> recognize -> Result -> User Review -> Confirm -> Create.
export interface RecognitionResult {
  name: string; category: string; brand?: string; type?: string;
  color?: string; confidence: number; suggestedDescription: string;
}
export interface RecognitionProvider {
  readonly id: string;
  recognizeImage: (localUri: string) => Promise<RecognitionResult>;
}

export class OnlineHeuristicProvider implements RecognitionProvider {
  readonly id = 'online-heuristic';
  async recognizeImage(localUri: string): Promise<RecognitionResult> {
    const lower = localUri.toLowerCase();
    const guess = lower.includes('cable') ? 'Cable' : lower.includes('chair') ? 'Chair' : lower.includes('box') ? 'Box' : 'Item';
    return { name: `${guess} (AI suggestion)`, category: 'Unsorted', confidence: 0.62, suggestedDescription: 'Review and edit before creating.' };
  }
}

export class OfflineUnavailableProvider implements RecognitionProvider {
  readonly id = 'offline-unavailable';
  async recognizeImage(): Promise<RecognitionResult> {
    throw new Error('AI recognition is unavailable offline. Enter manually or retry when online.');
  }
}

let provider: RecognitionProvider = new OnlineHeuristicProvider();
export function setRecognitionProvider(p: RecognitionProvider) { provider = p; }
export function recognizeImage(localUri: string) { return provider.recognizeImage(localUri); }
