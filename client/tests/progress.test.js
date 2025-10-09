import { describe, expect, it } from 'vitest';
import { computeProgress } from '../src/utils/progress.js';

describe('computeProgress', () => {
  const items = [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];

  it('returns zeroed values when there are no answers', () => {
    const result = computeProgress(items, {});
    expect(result).toEqual({ total: 3, answered: 0, correct: 0, accuracy: 0 });
  });

  it('calculates answered, correct and accuracy', () => {
    const responses = {
      1: { correct: true },
      2: { correct: false },
    };

    const result = computeProgress(items, responses);
    expect(result.total).toBe(3);
    expect(result.answered).toBe(2);
    expect(result.correct).toBe(1);
    expect(result.accuracy).toBe(33);
  });
});
