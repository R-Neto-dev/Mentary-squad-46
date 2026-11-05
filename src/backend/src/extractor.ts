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
};

export type ExtractionResult = {
  filename: string;
  mimetype: string;
  format: string;
  text: string;
  questions: ExtractedQuestion[];
};

const questionStart = /^(?:quest[aã]o\s*)?(\d{1,3})[.)\-:]\s*(.+)$/i;
const optionStart = /^\s*(?:\(?([A-E])\)?\s*[.)\-:]\s*|[-*]\s+)(.+)$/i;

export async function extractFile(
  file: Express.Multer.File,
): Promise<ExtractionResult> {
  const extension = file.originalname.split(".").pop()?.toLowerCase() ?? "";

  if (extension === "pdf" || file.mimetype === "application/pdf") {
    const parser = new PDFParse({ data: file.buffer });
    try {
      const parsed = await parser.getText();
      return buildResult(file, "pdf", parsed.text);
    } finally {
      await parser.destroy();
    }
  }

  if (["png", "jpg", "jpeg", "webp", "bmp"].includes(extension) ||
      file.mimetype.startsWith("image/")) {
    const worker = await createWorker("por");
    try {
      const { data } = await worker.recognize(file.buffer);
      return buildResult(file, "image", data.text);
    } finally {
      await worker.terminate();
    }
  }

  if (["csv", "txt"].includes(extension) || file.mimetype === "text/plain") {
    return buildResult(file, extension === "csv" ? "csv" : "text", file.buffer.toString("utf8"));
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

function buildResult(
  file: Express.Multer.File,
  format: string,
  text: string,
  rows?: Record<string, unknown>[],
): ExtractionResult {
  return {
    filename: file.originalname,
    mimetype: file.mimetype,
    format,
    text: text.trim(),
    questions: rows ? rowsToQuestions(rows) : parseQuestions(text),
  };
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

  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;

    const questionMatch = line.match(questionStart);
    if (questionMatch) {
      if (current) questions.push(current);
      current = {
        statement: questionMatch[2].trim(),
        options: [],
        source: { page: undefined },
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
