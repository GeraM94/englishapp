import {
  pickSubject,
  pickVerb,
  pickMarker,
  buildEnglishObject,
  buildSpanishObject,
  createItemBase,
  ensureTrailingPeriod,
  getFutureSimpleEs,
} from '../helpers.js';

export function generateFutureWill(rng) {
  const subject = pickSubject(rng);
  const verb = pickVerb(rng);
  const marker = pickMarker(rng, 'Future (will)');

  const objectEn = buildEnglishObject(verb);
  const objectEs = buildSpanishObject(verb);

  let sentenceEn = `${subject.en} will ${verb.base}`;
  if (objectEn) {
    sentenceEn += ` ${objectEn}`;
  }
  if (marker) {
    sentenceEn += ` ${marker.en}`;
  }

  let sentenceEs = `${subject.es} ${getFutureSimpleEs(subject, verb)}`;
  if (objectEs) {
    sentenceEs += ` ${objectEs}`;
  }
  if (marker) {
    sentenceEs += ` ${marker.es}`;
  }

  sentenceEn = ensureTrailingPeriod(sentenceEn.trim());
  sentenceEs = ensureTrailingPeriod(sentenceEs.trim());

  return createItemBase({
    sentenceEn,
    sentenceEs,
    correctTense: 'Future (will)',
    marker,
    rationale: marker?.rationale ?? 'Decisión o predicción con will.',
    meta: {
      subject,
      verb,
      objectEn,
      objectEs,
      marker,
    },
  });
}
