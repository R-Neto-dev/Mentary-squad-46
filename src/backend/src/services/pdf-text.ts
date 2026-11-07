import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { PageText } from '../types/extraction.js';

export async function extractPdfPages(buffer: Buffer): Promise<PageText[]> {
  const loadingTask = getDocument({ data: new Uint8Array(buffer) });
  const pdf = await loadingTask.promise;
  const pages: PageText[] = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
      .trim();

    pages.push({ page: pageNumber, text });
  }

  return pages;
}
