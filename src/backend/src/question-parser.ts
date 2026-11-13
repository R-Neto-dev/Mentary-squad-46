export type ParsedQuestion = {
  statement: string;
  options: string[];
  answer: number | null;
  type?: 'MULTIPLA ESCOLHA' | 'DISCURSIVA';
  source: { page?: number; row?: number };
  warnings?: string[];
};

// Letras e Índices são interpretados somente como gabaritos explícitos.
// answer_index: base zero. Campos answer/gabarito/resposta: letra ou número base um.
export function readAnswer(value: unknown, count: number, zeroBased = false): number | null {
  if (value === null || value === undefined || value === '') return null;
  const text = String(value).trim().toUpperCase();
  const letter = text.match(/^(?:ALTERNATIVA\s+)?\(?([A-Z])\)?[.)]?$/);
  const index = letter ? letter[1].charCodeAt(0) - 65
    : /^\d+$/.test(text) ? Number(text) - (zeroBased ? 0 : 1) : -1;
  return Number.isInteger(index) && index >= 0 && index < count ? index : null;
}

export function parseQuestionText(text: string): ParsedQuestion[] {
  const result: ParsedQuestion[] = [];
  const answerKey = new Map<number, string | null>();
  const candidates = new Map<ParsedQuestion, string[]>();
  const letters = new Map<ParsedQuestion, string[]>();
  let current: ParsedQuestion | undefined;
  let option: number | undefined;
  let page: number | undefined;
  let inKey = false;
  const addKey = (number: number, answer: string) => {
    answerKey.set(number, answerKey.has(number) && answerKey.get(number) !== answer ? null : answer);
  };
  for (const raw of text.split(/\r?\n/)) {
    let line = raw.trim();
    if (!line) continue;
    const pageMatch = line.match(/^\[\[PAGE:(\d+)\]\]$/);
    if (pageMatch) { page = Number(pageMatch[1]); continue; }
    const heading = line.match(/^gabaritos?(?:\s+(?:oficial|das?\s+quest[oõ]es))?\s*[:\-]?\s*(.*)$/i);
    // "Gabarito: B" pertence é questão atual; "Gabarito: 1-A ..." inicia tabela.
    const inline = line.match(/^(?:gabarito|resposta(?:\s+correta)?|alternativa\s+correta)\s*[:=\-]\s*(?:alternativa\s+)?\(?([A-Z])\)?[.)]?\s*$/i);
    if (inline && current && !inKey) {
      candidates.get(current)!.push(inline[1].toUpperCase()); option = undefined; continue;
    }
    if (heading) { inKey = true; line = heading[1].trim(); if (!line) continue; }
    if (inKey) {
      // Aceita linhas "1-A 2-B", "1. A; 2. B" e "1 A".
      const pairPattern = /(\d{1,4})\s*(?:[.\-:)=]\s*|\s+)([A-Z])\b/gi;
      const pairs = [...line.matchAll(pairPattern)];
      const rest = line.replace(pairPattern, '').replace(/[\s;,|]+/g, '');
      if (pairs.length && !rest) for (const match of pairs) addKey(Number(match[1]), match[2].toUpperCase());
      continue;
    }
    const start = line.match(/^(?:quest[aã]o\s*)?(\d{1,4})[.)\-:]\s*(.+)$/i);
    if (start) {
      current = {statement:start[2].trim(), options:[], answer:null, source:{page,row:Number(start[1])}};
      result.push(current); candidates.set(current, []); letters.set(current, []); option = undefined; continue;
    }
    const alternative = line.match(/^(?:\(([A-Z])\)|([A-Z])\s*[.)\-:]|([-*])\s+)\s*(.+)$/i);
    if (current && alternative) {
      current.options.push(alternative[4].trim());
      letters.get(current)!.push((alternative[1] || alternative[2] || String.fromCharCode(65 + current.options.length - 1)).toUpperCase());
      option = current.options.length - 1; continue;
    }
    if (current) {
      if (option === undefined) current.statement += ' ' + line;
      else current.options[option] += ' ' + line;
    }
  }
  const numberCounts = new Map<number,number>();
  for (const q of result) numberCounts.set(q.source.row!, (numberCounts.get(q.source.row!) ?? 0) + 1);
  for (const q of result) {
    q.type = q.options.length ? 'MULTIPLA ESCOLHA' : 'DISCURSIVA';
    if (q.type === 'DISCURSIVA') {
      q.statement = q.statement.replace(/_{3,}/g, '').trim();
      q.answer = null;
      continue;
    }
    const warnings: string[] = [];
    const answers = [...candidates.get(q)!];
    if (answerKey.has(q.source.row!)) {
      const value = answerKey.get(q.source.row!);
      if (numberCounts.get(q.source.row!)! > 1) warnings.push('Numeração repetida: gabarito da tabela não associado.');
      else if (value === null) warnings.push('A tabela contém gabaritos conflitantes.');
      else if (value) answers.push(value);
    }
    const unique = [...new Set(answers)];
    if (unique.length > 1) warnings.push('Gabaritos conflitantes: informe a alternativa correta manualmente.');
    else if (unique.length === 1 && !warnings.length) {
      const index = letters.get(q)!.indexOf(unique[0]);
      if (index >= 0) q.answer = index;
      else warnings.push('O gabarito aponta para uma alternativa não encontrada.');
    }
    if (warnings.length) q.warnings = warnings;
  }
  return result;
}
