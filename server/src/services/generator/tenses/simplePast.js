import {
  pickSubject,
  pickVerb,
  pickMarker,
  getPastSimpleEn,
  getPastSimpleEs,
  buildEnglishObject,
  buildSpanishObject,
  createItemBase,
  ensureTrailingPeriod,
} from '../helpers.js';

export function generateSimplePast(rng) {
  const subject = pickSubject(rng);
  const verb = pickVerb(rng);
  const marker = pickMarker(rng, 'Simple Past');

  const objectEn = buildEnglishObject(verb);
  const objectEs = buildSpanishObject(verb);
  const verbPastEn = getPastSimpleEn(verb);
  const verbPastEs = getPastSimpleEs(subject, verb);

  let sentenceEn = `${subject.en} ${verbPastEn}`;
  if (objectEn) {
    sentenceEn += ` ${objectEn}`;
  }
  if (marker) {
    sentenceEn += ` ${marker.en}`;
  }

  let sentenceEs = `${subject.es} ${verbPastEs}`;
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
    correctTense: 'Simple Past',
    marker,
    rationale: marker?.rationale ?? 'Acción finalizada en el pasado.',
    meta: {
      subject,
      verb,
      objectEn,
      objectEs,
      marker,
    },
  });
}
