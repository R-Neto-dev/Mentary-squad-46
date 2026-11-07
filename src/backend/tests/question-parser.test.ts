import { describe, expect, it } from 'vitest';
import { parseQuestions } from '../src/services/question-parser.js';

describe('parseQuestions', () => {
  it('separates prompt and alternatives preserving page', () => {
    const result = parseQuestions([
      {
        page: 2,
        text: `1) Qual é a capital do Brasil?\nA) São Paulo\nB) Brasília\nC) Rio de Janeiro\n2) Quanto é 2 + 2?\nA) 3\nB) 4\nC) 5`,
      },
    ]);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      prompt: 'Qual é a capital do Brasil?',
      sourcePage: 2,
      alternatives: [
        { label: 'A', text: 'São Paulo' },
        { label: 'B', text: 'Brasília' },
        { label: 'C', text: 'Rio de Janeiro' },
      ],
    });
    expect(result[1].sourcePage).toBe(2);
  });

  it('supports multiline alternatives', () => {
    const result = parseQuestions([
      {
        page: 1,
        text: `1) Leia o texto e responda.\nA) Primeira parte\ncontinuação da alternativa\nB) Segunda alternativa`,
      },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].alternatives[0].text).toBe('Primeira parte continuação da alternativa');
  });
});
