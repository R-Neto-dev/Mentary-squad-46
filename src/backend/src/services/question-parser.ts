import { ExtractedQuestion, PageText } from '../types/extraction.js';

const QUESTION_START = /^(?:Quest[aã]o\s*)?(\d+)[\)\.\-:]\s*(.*)$/i;
const ALTERNATIVE_START = /^([A-E])[\)\.\-:]\s*(.*)$/i;

export function parseQuestions(pages: PageText[]): ExtractedQuestion[] {
  const questions: ExtractedQuestion[] = [];

  for (const page of pages) {
    const lines = page.text
      .replace(/\r/g, '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    let current: ExtractedQuestion | null = null;
    let currentAlternativeIndex = -1;

    const flushCurrent = () => {
      if (!current) return;
      current.prompt = current.prompt.trim();
      current.alternatives = current.alternatives
        .map((alt) => ({ ...alt, text: alt.text.trim() }))
        .filter((alt) => alt.text.length > 0);
      if (current.prompt.length > 0 && current.alternatives.length >= 2) {
        questions.push(current);
      }
      current = null;
      currentAlternativeIndex = -1;
    };

    for (const line of lines) {
      const questionMatch = line.match(QUESTION_START);
      if (questionMatch) {
        flushCurrent();
        current = {
          prompt: questionMatch[2] ?? '',
          alternatives: [],
          sourcePage: page.page,
        };
        continue;
      }

      if (!current) {
        continue;
      }

      const alternativeMatch = line.match(ALTERNATIVE_START);
      if (alternativeMatch) {
        current.alternatives.push({
          label: alternativeMatch[1].toUpperCase(),
          text: alternativeMatch[2] ?? '',
        });
        currentAlternativeIndex = current.alternatives.length - 1;
        continue;
      }

      if (currentAlternativeIndex >= 0) {
        current.alternatives[currentAlternativeIndex].text += ` ${line}`;
      } else {
        current.prompt += ` ${line}`;
      }
    }

    flushCurrent();
  }

  return questions;
}
