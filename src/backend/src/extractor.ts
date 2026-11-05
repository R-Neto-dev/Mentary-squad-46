import { createWorker } from "tesseract.js";
import { PDFParse } from "pdf-parse";
import * as XLSX from "xlsx";

export type ExtractedQuestion = {
  statement: string;
  options: string[];
  source: {
    page?: number;
    row?: number;
  };
  confidence?: number;
};

export type ExtractionResult = {
  filename: string;
  mimetype: string;
  format: string;
  text: string;
  questions: ExtractedQuestion[];
  ocr?: {
    engine: "tesseract";
    confidence: number;
  };
};

// Detecta o início de uma questão numerada, aceitando os separadores mais comuns.
const questionStart = /^(?:quest[aã]o\s*)?(\d{1,3})[.)\-:]\s*(.+)$/i;

// Detecta alternativas no padrão A), A. ou A - texto, além de marcadores de lista.
const optionStart = /^\s*(?:\(?([A-E])\)?\s*[.)\-:]\s*|[-*]\s+)(.+)$/i;

// Extrai um arquivo e escolhe o leitor adequado ao formato recebido.
export async function extractFile(
  file: Express.Multer.File,
): Promise<ExtractionResult> {
  const extension = file.originalname.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "pdf" || file.mimetype === "application/pdf") {
    // A primeira tentativa é sempre a extração nativa, que é mais rápida e precisa.
    const parser = new PDFParse({ data: file.buffer });
    try {
      const parsed = await parser.getText();
      const text = cleanExtractedText(parsed.text);

      // PDF escaneado normalmente não possui camada de texto; nesse caso, usa OCR.
      if (text.length >= 20) {
        return buildResult(file, "pdf", text);
      }

      return await extractPdfWithOcr(file, parser);
    } finally {
      await parser.destroy();
    }
  }

  if (["png", "jpg", "jpeg", "webp", "bmp"].includes(extension) ||
      file.mimetype.startsWith("image/")) {
    // Imagens são processadas pelo Tesseract com o modelo de português.
    const ocr = await recognizeImage(file.buffer);
    return {
      ...buildResult(file, "image", ocr.text),
      ocr: { engine: "tesseract", confidence: ocr.confidence },
    };
  }

  if (["csv", "txt"].includes(extension) || file.mimetype === "text/plain") {
    return buildResult(
      file,
      extension === "csv" ? "csv" : "text",
      file.buffer.toString("utf8"),
    );
  }

  if (["xlsx", "xls"].includes(extension)) {
    const workbook = XLSX.read(file.buffer, { type: "buffer" });
    const rows = workbook.SheetNames.flatMap((sheetName) =>
      XLSX.utils.sheet_to_json<Record<string, unknown>>(
        workbook.Sheets[sheetName],
        { defval: "" },
      ),
    );
    const text = rows.map((row) => Object.values(row).join(" | ")).join("\n");
    return buildResult(file, "spreadsheet", text, rows);
  }

  if (extension === "json" || file.mimetype === "application/json") {
    return buildJsonResult(file);
  }

  throw new UnsupportedFormatError(
    `Formato não suportado: ${extension || file.mimetype || "desconhecido"}`,
  );
}

class UnsupportedFormatError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsupportedFormatError";
  }
}

export function isUnsupportedFormatError(error: unknown): error is UnsupportedFormatError {
  return error instanceof UnsupportedFormatError;
}

// Monta a resposta pública padronizada para todos os formatos textuais.
function buildResult(
  file: Express.Multer.File,
  format: string,
  text: string,
  rows?: Record<string, unknown>[],
): ExtractionResult {
  const cleanedText = cleanExtractedText(text);

  return {
    filename: file.originalname,
    mimetype: file.mimetype,
    format,
    text: cleanedText,
    questions: rows ? rowsToQuestions(rows) : parseQuestions(cleanedText),
  };
}

// Executa OCR em todas as páginas de um PDF sem camada de texto.
async function extractPdfWithOcr(
  file: Express.Multer.File,
  parser: PDFParse,
): Promise<ExtractionResult> {
  const screenshots = await parser.getScreenshot({
    desiredWidth: 1800,
    imageBuffer: true,
  });
  const pages: string[] = [];
  const confidences: number[] = [];

  for (const [index, page] of screenshots.pages.entries()) {
    const ocr = await recognizeImage(Buffer.from(page.data));
    pages.push(`[[PAGE:${index + 1}]]\n${ocr.text}`);
    confidences.push(ocr.confidence);
  }

  const confidence = confidences.length > 0
    ? confidences.reduce((sum, value) => sum + value, 0) / confidences.length
    : 0;
  const text = pages.join("\n");

  return {
    ...buildResult(file, "pdf-ocr", text),
    ocr: { engine: "tesseract", confidence },
  };
}

// Executa o motor OCR e devolve o texto junto com a confiança média do resultado.
async function recognizeImage(
  image: Buffer,
): Promise<{ text: string; confidence: number }> {
  const worker = await createWorker("por");
  try {
    const { data } = await worker.recognize(image);
    return {
      text: data.text,
      confidence: data.confidence,
    };
  } finally {
    // Encerra o worker para não deixar processos e memória presos no container.
    await worker.terminate();
  }
}

function buildJsonResult(file: Express.Multer.File): ExtractionResult {
  let value: unknown;
  try {
    value = JSON.parse(file.buffer.toString("utf8").replace(/^\uFEFF/, ""));
  } catch {
    throw new Error("O arquivo JSON não é válido.");
  }

  const items = Array.isArray(value)
    ? value
    : isRecord(value) && Array.isArray(value.questions)
      ? value.questions
      : [value];
  const questions = items.map((item, index) => {
    if (!isRecord(item)) {
      throw new Error(`O item ${index + 1} do JSON precisa ser um objeto.`);
    }
    return {
      statement: String(item.statement ?? item.title ?? item.enunciado ?? "").trim(),
      options: toStringArray(item.options ?? item.answer_options ?? item.alternatives),
      source: { row: index + 1 },
    };
  });

  return {
    filename: file.originalname,
    mimetype: file.mimetype,
    format: "json",
    text: JSON.stringify(value, null, 2),
    questions,
  };
}

function parseQuestions(text: string): ExtractedQuestion[] {
  const questions: ExtractedQuestion[] = [];
  let current: ExtractedQuestion | undefined;
  let currentOption: number | undefined;
  let currentPage: number | undefined;

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    // Marcadores internos permitem manter a página quando o PDF precisou de OCR.
    const pageMatch = line.match(/^\[\[PAGE:(\d+)\]\]$/);
    if (pageMatch) {
      currentPage = Number(pageMatch[1]);
      continue;
    }

    const questionMatch = line.match(questionStart);
    if (questionMatch) {
      if (current) questions.push(current);
      current = {
        statement: questionMatch[2].trim(),
        options: [],
        source: { page: currentPage },
      };
      currentOption = undefined;
      continue;
    }

    const optionMatch = line.match(optionStart);
    if (current && optionMatch) {
      current.options.push(optionMatch[2].trim());
      currentOption = current.options.length - 1;
      continue;
    }

    if (currentOption !== undefined && current) {
      current.options[currentOption] += ` ${line}`;
    } else if (current) {
      current.statement += ` ${line}`;
    }
  }

  if (current) questions.push(current);
  return questions;
}

function rowsToQuestions(rows: Record<string, unknown>[]): ExtractedQuestion[] {
  return rows.map((row, index) => ({
    statement: String(
      row.statement ?? row.title ?? row.enunciado ?? row.question ?? "",
    ).trim(),
    options: toStringArray(row.options ?? row.answer_options ?? row.alternatives),
    source: { row: index + 1 },
  }));
}

// Remove artefatos recorrentes de PDFs, como rodapés e marcadores de paginação.
function cleanExtractedText(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    // Remove rodapés que podem aparecer colados ao final de uma alternativa.
    .replace(
      /\s+Avalia(?:ç|c)[aã]o de Conhecimentos\s*[—-]\s*Simulado\s+Page\s+\d+\s+of\s+\d+\s*$/i,
      "",
    )
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .filter((line) => line.length > 0)
    .filter((line) => !/^--\s*\d+\s+of\s+\d+\s*--$/i.test(line))
    .filter((line) => !/^(?:page|página)\s+\d+\s+of\s+\d+$/i.test(line))
    .filter((line) => !/^avaliação de conhecimentos\s*[—-]\s*simulado$/i.test(line))
    .join("\n")
    .trim();
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim()) {
    return value.split(/\s*[|;]\s*/).map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
