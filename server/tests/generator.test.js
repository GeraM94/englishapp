import { describe, expect, it } from 'vitest';
import { generateItems } from '../src/services/generator/index.js';

describe('Sentence generator', () => {
  it('generates the requested number of unique items', () => {
    const { items } = generateItems({
      tenses: ['Present Simple'],
      count: 10,
      seed: 'unit-test-1',
      mode: 'multiple-choice',
    });

    expect(items).toHaveLength(10);
    const uniqueSentences = new Set(items.map((item) => item.sentenceEn));
    expect(uniqueSentences.size).toBe(10);
  });

  it('creates options with one correct answer and three distractors', () => {
    const { items } = generateItems({
      tenses: ['Present Perfect Continuous'],
      count: 10,
      seed: 'unit-test-2',
      mode: 'multiple-choice',
    });

    items.forEach((item) => {
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
      expect(item.options).toContain(item.correctTense);
    });
  });

  it('mixes multiple tenses when several are selected', () => {
    const { items } = generateItems({
      tenses: ['Present Simple', 'Simple Past', 'Future (will)'],
      count: 20,
      seed: 'unit-test-3',
      mode: 'multiple-choice',
    });

    const tenses = new Set(items.map((item) => item.correctTense));
    expect(tenses.size).toBeGreaterThan(1);
  });

  it('attaches rationale aligned with the detected trigger', () => {
    const { items } = generateItems({
      tenses: ['Past Perfect Continuous'],
      count: 10,
      seed: 'unit-test-4',
      mode: 'multiple-choice',
    });

    items.forEach((item) => {
      expect(item.trigger).toBeTruthy();
      expect(item.rationale).toContain(item.trigger.split(' ')[0]);
    });
  });

  it('creates cloze items with shuffled options and explanations', () => {
    const { items, mode } = generateItems({
      tenses: ['Present Perfect Continuous'],
      count: 10,
      seed: 'cloze-1',
      mode: 'cloze',
    });

    expect(mode).toBe('cloze');
    expect(items).toHaveLength(10);

    items.forEach((item) => {
      expect(item.sentenceCloze).toContain('_____');
      expect(item.blankCount === 1 || item.blankCount === 2).toBe(true);
      expect(item.options).toHaveLength(4);
      expect(new Set(item.options).size).toBe(4);
      expect(item.distractors).toHaveLength(3);
      expect(item.explanation).toContain(item.correctAnswer.split(' ')[0]);
    });
  });

  it('avoids duplicates in cloze mode even with higher counts', () => {
    const { items } = generateItems({
      tenses: ['Past Perfect Continuous', 'Present Perfect Continuous'],
      count: 20,
      seed: 'cloze-2',
      mode: 'cloze',
    });

    const keys = new Set(
      items.map((item) => `${item.sentenceCloze}|${item.correctAnswer}|${item.correctTense}`)
    );
    expect(keys.size).toBe(20);
  });
});
