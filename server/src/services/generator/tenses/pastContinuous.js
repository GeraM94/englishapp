import {
  pickSubject,
  pickVerb,
  pickMarker,
  buildEnglishObject,
  buildSpanishObject,
  createItemBase,
  ensureTrailingPeriod,
} from '../helpers.js';

export function generatePastContinuous(rng) {
  const subject = pickSubject(rng);
  const verb = pickVerb(rng);
  const marker = pickMarker(rng, 'Past Continuous');

  const objectEn = buildEnglishObject(verb);
  const objectEs = buildSpanishObject(verb);

  let sentenceEn = `${subject.en} ${subject.bePast} ${verb.gerund}`;
  if (objectEn) {
    sentenceEn += ` ${objectEn}`;
  }
  if (marker) {
    sentenceEn += ` ${marker.en}`;
  }

  let sentenceEs = `${subject.es} ${subject.esBePast} ${verb.es.gerund}`;
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
    correctTense: 'Past Continuous',
    marker,
    rationale: marker?.rationale ?? 'Acción en desarrollo interrumpida en el pasado.',
  });
}
