import {
  pickSubject,
  pickVerb,
  pickMarker,
  buildEnglishObject,
  buildSpanishObject,
  createItemBase,
  ensureTrailingPeriod,
} from '../helpers.js';

export function generatePresentPerfect(rng) {
  const subject = pickSubject(rng);
  const verb = pickVerb(rng);
  const marker = pickMarker(rng, 'Present Perfect');

  const objectEn = buildEnglishObject(verb);
  const objectEs = buildSpanishObject(verb);

  const partsEn = [subject.en, subject.havePresent];
  if (marker?.en === 'already') {
    partsEn.push(marker.en);
  }
  partsEn.push(verb.participle);
  if (objectEn) {
    partsEn.push(objectEn);
  }
  if (marker && marker.en !== 'already') {
    partsEn.push(marker.en);
  }
  let sentenceEn = partsEn.join(' ');

  let sentenceEs = `${subject.es} ${subject.esHavePresent}`;
  if (marker?.en === 'already') {
    sentenceEs += ` ${marker.es}`;
  }
  sentenceEs += ` ${verb.es.participle}`;
  if (objectEs) {
    sentenceEs += ` ${objectEs}`;
  }
  if (marker && marker.en !== 'already') {
    sentenceEs += ` ${marker.es}`;
  }

  sentenceEn = ensureTrailingPeriod(sentenceEn.trim());
  sentenceEs = ensureTrailingPeriod(sentenceEs.trim());

  return createItemBase({
    sentenceEn,
    sentenceEs,
    correctTense: 'Present Perfect',
    marker,
    rationale: marker?.rationale ?? 'Resultado presente de una acción pasada.',
    meta: {
      subject,
      verb,
      objectEn,
      objectEs,
      marker,
    },
  });
}
