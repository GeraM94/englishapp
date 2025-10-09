import {
  pickSubject,
  pickVerb,
  pickMarker,
  buildEnglishObject,
  buildSpanishObject,
  createItemBase,
  ensureTrailingPeriod,
} from '../helpers.js';

export function generatePresentPerfectContinuous(rng) {
  const subject = pickSubject(rng);
  const verb = pickVerb(rng);
  const marker = pickMarker(rng, 'Present Perfect Continuous');

  const objectEn = buildEnglishObject(verb);
  const objectEs = buildSpanishObject(verb);

  let sentenceEn = `${subject.en} ${subject.havePresent} been ${verb.gerund}`;
  if (objectEn) {
    sentenceEn += ` ${objectEn}`;
  }
  if (marker) {
    sentenceEn += ` ${marker.en}`;
  }

  let sentenceEs = `${subject.es} ${subject.esHavePresent} estado ${verb.es.gerund}`;
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
    correctTense: 'Present Perfect Continuous',
    marker,
    rationale: marker?.rationale ?? 'Acción continua que conecta pasado y presente.',
  });
}
