import express, { Request, Response } from 'express';
import multer from 'multer';
import { runOcrForImage } from './services/ocr.js';
import { extractPdfPages } from './services/pdf-text.js';
import { parseQuestions } from './services/question-parser.js';
import { OcrProcessingError, PageText } from './types/extraction.js';

const upload = multer({ storage: multer.memoryStorage() });

type Dependencies = {
  extractPdfPagesFn?: (buffer: Buffer) => Promise<PageText[]>;
  runOcrForImageFn?: (buffer: Buffer) => Promise<string>;
};

export function createApp(dependencies: Dependencies = {}) {
  const app = express();

  const pdfExtractor = dependencies.extractPdfPagesFn ?? extractPdfPages;
  const ocrExtractor = dependencies.runOcrForImageFn ?? runOcrForImage;

  app.post('/api/extractions/questions', upload.single('file'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'Arquivo não enviado.' });
      }

      const { mimetype, buffer } = req.file;
      let pages: PageText[];

      if (mimetype === 'application/pdf') {
        pages = await pdfExtractor(buffer);
      } else if (mimetype.startsWith('image/')) {
        const text = await ocrExtractor(buffer);
        pages = [{ page: 1, text }];
      } else {
        return res.status(400).json({ message: 'Formato não suportado. Use PDF ou imagem.' });
      }

      const questions = parseQuestions(pages);

      return res.status(200).json({
        fileName: req.file.originalname,
        questions,
      });
    } catch (error) {
      if (error instanceof OcrProcessingError) {
        return res.status(422).json({
          message: error.message,
          code: 'OCR_ERROR',
        });
      }

      return res.status(500).json({
        message: error instanceof Error ? error.message : 'Erro interno na extração de questões.',
      });
    }
  });

  return app;
}
