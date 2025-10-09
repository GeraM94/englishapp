import {
  pickSubject,
  pickVerb,
  pickMarker,
  getPresentSimpleEn,
  getPresentSimpleEs,
  buildEnglishObject,
  buildSpanishObject,
  createItemBase,
  ensureTrailingPeriod,
} from '../helpers.js';

const ADVERB_MARKERS = new Set(['usually', 'often']);

export function generatePresentSimple(rng) {
  const subject = pickSubject(rng);
  const verb = pickVerb(rng);
  const marker = pickMarker(rng, 'Present Simple');

  const verbForm = getPresentSimpleEn(subject, verb);
  const objectEn = buildEnglishObject(verb);
  const objectEs = buildSpanishObject(verb);

  let sentenceEn;
  let sentenceEs;

  if (marker && ADVERB_MARKERS.has(marker.en)) {
    sentenceEn = `${subject.en} ${marker.en} ${verbForm} ${objectEn}`.trim();
    sentenceEs = `${subject.es} ${marker.es} ${getPresentSimpleEs(subject, verb)} ${objectEs}`.trim();
  } else if (marker && marker.en.startsWith('every')) {
    sentenceEn = `${subject.en} ${verbForm} ${objectEn} ${marker.en}`.trim();
    sentenceEs = `${subject.es} ${getPresentSimpleEs(subject, verb)} ${objectEs} ${marker.es}`.trim();
  } else if (marker) {
    sentenceEn = `${subject.en} ${verbForm} ${objectEn} ${marker.en}`.trim();
    sentenceEs = `${subject.es} ${getPresentSimpleEs(subject, verb)} ${objectEs} ${marker.es}`.trim();
  } else {
    sentenceEn = `${subject.en} ${verbForm} ${objectEn}`.trim();
    sentenceEs = `${subject.es} ${getPresentSimpleEs(subject, verb)} ${objectEs}`.trim();
  }

  sentenceEn = ensureTrailingPeriod(sentenceEn);
  sentenceEs = ensureTrailingPeriod(sentenceEs);

  return createItemBase({
    sentenceEn,
    sentenceEs,
    correctTense: 'Present Simple',
    marker,
    rationale: marker?.rationale ?? 'Acción habitual expresada en Present Simple.',
    meta: {
      subject,
      verb,
      objectEn,
      objectEs,
      marker,
    },
  });
}
