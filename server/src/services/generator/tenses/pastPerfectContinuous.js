import {
  pickSubject,
  pickVerb,
  pickMarker,
  buildEnglishObject,
  buildSpanishObject,
  createItemBase,
  ensureTrailingPeriod,
} from '../helpers.js';

export function generatePastPerfectContinuous(rng) {
  const subject = pickSubject(rng);
  const verb = pickVerb(rng);
  const marker = pickMarker(rng, 'Past Perfect Continuous');

  const objectEn = buildEnglishObject(verb);
  const objectEs = buildSpanishObject(verb);

  let sentenceEn = `${subject.en} had been ${verb.gerund}`;
  if (objectEn) {
    sentenceEn += ` ${objectEn}`;
  }
  if (marker) {
    sentenceEn += ` ${marker.en}`;
  }

  let sentenceEs = `${subject.es} ${subject.esHavePast} estado ${verb.es.gerund}`;
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
    correctTense: 'Past Perfect Continuous',
    marker,
    rationale: marker?.rationale ?? 'Acción prolongada previa a otro evento pasado.',
  });
}
