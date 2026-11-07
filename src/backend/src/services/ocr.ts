import { createWorker } from 'tesseract.js';
import { OcrProcessingError } from '../types/extraction.js';

export async function runOcrForImage(buffer: Buffer): Promise<string> {
  const worker = await createWorker('por');

  try {
    const {
      data: { text },
    } = await worker.recognize(buffer);

    return text.trim();
  } catch (error) {
    throw new OcrProcessingError(
      `Falha no OCR em português: ${error instanceof Error ? error.message : 'erro desconhecido'}`,
    );
  } finally {
    await worker.terminate();
  }
}
