export interface Alternative {
  label: string;
  text: string;
}

export interface ExtractedQuestion {
  prompt: string;
  alternatives: Alternative[];
  sourcePage: number;
}

export interface PageText {
  page: number;
  text: string;
}

export class OcrProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OcrProcessingError';
  }
}
