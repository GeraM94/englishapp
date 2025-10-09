import { describe, expect, it } from 'vitest';
import { generateItems } from '../src/services/generator/index.js';

describe('Sentence generator', () => {
  it('generates the requested number of unique items', () => {
    const { items } = generateItems({
      tenses: ['Present Simple'],
      count: 10,
      seed: 'unit-test-1',
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
    });

    const tenses = new Set(items.map((item) => item.correctTense));
    expect(tenses.size).toBeGreaterThan(1);
  });

  it('attaches rationale aligned with the detected trigger', () => {
    const { items } = generateItems({
      tenses: ['Past Perfect Continuous'],
      count: 10,
      seed: 'unit-test-4',
    });

    items.forEach((item) => {
      expect(item.trigger).toBeTruthy();
      expect(item.rationale).toContain(item.trigger.split(' ')[0]);
    });
  });
});
