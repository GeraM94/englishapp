import { randomUUID } from 'crypto';
import { SUBJECTS } from './data/subjects.js';
import { VERBS } from './data/verbs.js';
import { MARKERS } from './data/markers.js';

export function pickSubject(rng) {
  return rng.pick(SUBJECTS);
}

export function pickVerb(rng) {
  return rng.pick(VERBS);
}

export function pickMarker(rng, tense) {
  const options = MARKERS[tense] ?? [];
  if (!options.length) {
    return null;
  }
  return rng.pick(options);
}

export function getPresentSimpleEn(subject, verb) {
  return subject.person === '3s' ? verb.thirdPerson : verb.base;
}

export function getPresentSimpleEs(subject, verb) {
  return verb.es.present[subject.person];
}

export function getPastSimpleEn(verb) {
  return verb.past;
}

export function getPastSimpleEs(subject, verb) {
  return verb.es.past[subject.person];
}

export function getFutureSimpleEs(subject, verb) {
  return verb.es.future[subject.person];
}

export function buildEnglishObject(verb) {
  return verb.objectEn;
}

export function buildSpanishObject(verb) {
  return verb.objectEs;
}

export function createItemBase({
  sentenceEn,
  sentenceEs,
  correctTense,
  marker,
  rationale,
  meta = {},
}) {
  return {
    id: randomUUID(),
    sentenceEn,
    sentenceEs,
    correctTense,
    rationale,
    trigger: marker?.en ?? null,
    triggerEs: marker?.es ?? null,
    meta,
  };
}

export function ensureTrailingPeriod(text) {
  if (!text.endsWith('.')) {
    return `${text}.`;
  }
  return text;
}
