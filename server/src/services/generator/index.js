import { createRandom, shuffle } from './random.js';
import { ALL_TENSES } from './constants.js';
import { generatePresentSimple } from './tenses/presentSimple.js';
import { generatePresentContinuous } from './tenses/presentContinuous.js';
import { generatePresentPerfect } from './tenses/presentPerfect.js';
import { generatePresentPerfectContinuous } from './tenses/presentPerfectContinuous.js';
import { generateSimplePast } from './tenses/simplePast.js';
import { generatePastContinuous } from './tenses/pastContinuous.js';
import { generatePastPerfectContinuous } from './tenses/pastPerfectContinuous.js';
import { generateFutureWill } from './tenses/futureWill.js';
import { generateBeGoingTo } from './tenses/beGoingTo.js';

const GENERATORS = {
  'Present Simple': generatePresentSimple,
  'Present Continuous': generatePresentContinuous,
  'Present Perfect': generatePresentPerfect,
  'Present Perfect Continuous': generatePresentPerfectContinuous,
  'Simple Past': generateSimplePast,
  'Past Continuous': generatePastContinuous,
  'Past Perfect Continuous': generatePastPerfectContinuous,
  'Future (will)': generateFutureWill,
  'Be going to': generateBeGoingTo,
};

function buildOptions(correctTense, selectedTenses, rng) {
  const pool = new Set(ALL_TENSES);
  selectedTenses.forEach((tense) => pool.add(tense));
  pool.delete(correctTense);
  const candidates = shuffle([...pool], rng);
  const distractors = candidates.slice(0, 3);
  const options = shuffle([correctTense, ...distractors], rng);
  return options;
}

export function generateItems({ tenses, count, seed }) {
  const selected = (tenses ?? []).filter((tense) => GENERATORS[tense]);
  if (!selected.length) {
    throw new Error('No hay generadores disponibles para los tiempos solicitados.');
  }

  const uniqueTenses = [...new Set(selected)];
  const generationSeed = seed || `${Date.now()}-${Math.round(Math.random() * 1000000)}`;
  const rng = createRandom(generationSeed);

  const items = [];
  const seen = new Set();
  const maxAttempts = count * 25;
  let attempts = 0;

  while (items.length < count && attempts < maxAttempts) {
    attempts += 1;
    const tense = rng.pick(uniqueTenses);
    const generator = GENERATORS[tense];
    const item = generator(rng);

    const key = `${item.sentenceEn}|${tense}`;
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    const options = buildOptions(item.correctTense, uniqueTenses, rng);
    items.push({ ...item, options, seed: generationSeed });
  }

  if (items.length < count) {
    throw new Error('No fue posible generar suficientes oraciones únicas.');
  }

  return {
    seed: generationSeed,
    tenses: uniqueTenses,
    items: shuffle(items, rng),
  };
}
