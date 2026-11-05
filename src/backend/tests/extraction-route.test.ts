import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { OcrProcessingError } from '../src/types/extraction.js';

describe('POST /api/extractions/questions', () => {
  it('extracts questions from image OCR text', async () => {
    const app = createApp({
      runOcrForImageFn: async () => '1) Pergunta teste\nA) Opção 1\nB) Opção 2',
    });

    const response = await request(app)
      .post('/api/extractions/questions')
      .attach('file', Buffer.from('fake-image'), { filename: 'prova.png', contentType: 'image/png' });

    expect(response.status).toBe(200);
    expect(response.body.questions).toHaveLength(1);
    expect(response.body.questions[0].sourcePage).toBe(1);
    expect(response.body.questions[0].alternatives).toHaveLength(2);
  });

  it('returns OCR error response when OCR fails', async () => {
    const app = createApp({
      runOcrForImageFn: async () => {
        throw new OcrProcessingError('Falha no OCR em português: timeout');
      },
    });

    const response = await request(app)
      .post('/api/extractions/questions')
      .attach('file', Buffer.from('fake-image'), { filename: 'prova.png', contentType: 'image/png' });

    expect(response.status).toBe(422);
    expect(response.body.code).toBe('OCR_ERROR');
  });

  it('preserves source page for PDF extraction', async () => {
    const app = createApp({
      extractPdfPagesFn: async () => [
        { page: 3, text: '1) Pergunta PDF\nA) Alt 1\nB) Alt 2' },
      ],
    });

    const response = await request(app)
      .post('/api/extractions/questions')
      .attach('file', Buffer.from('%PDF-1.4'), {
        filename: 'questoes.pdf',
        contentType: 'application/pdf',
      });

    expect(response.status).toBe(200);
    expect(response.body.questions).toHaveLength(1);
    expect(response.body.questions[0].sourcePage).toBe(3);
  });
});
