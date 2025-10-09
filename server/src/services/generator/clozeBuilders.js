import { ensureTrailingPeriod, getPresentSimpleEn } from './helpers.js';
import { shuffle } from './random.js';

const PATTERN_HINTS = {
  'Present Simple':
    'hablamos de hábitos o verdades generales con la forma base en presente simple.',
  'Present Continuous':
    'seguimos la estructura be (am/is/are) + verbo en -ing para acciones en progreso.',
  'Present Perfect':
    'usamos have/has + participio para resultados que impactan el presente.',
  'Present Perfect Continuous':
    'usamos have/has been + verbo en -ing para actividades que comenzaron en el pasado y continúan.',
  'Simple Past':
    'empleamos la forma pasada simple para acciones terminadas en un momento definido.',
  'Past Continuous':
    'se forma con was/were + verbo en -ing para describir acciones en progreso en el pasado.',
  'Past Perfect Continuous':
    'requiere had been + verbo en -ing para una acción prolongada previa a otro evento pasado.',
  'Future (will)':
    'utilizamos will + verbo base para decisiones instantáneas o predicciones.',
  'Be going to':
    'usamos be going to + verbo base para planes ya decididos o evidentes.',
};

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function splitPhrase(correct, mainPart) {
  const trimmedCorrect = normalize(correct);
  const trimmedMain = normalize(mainPart);
  if (!trimmedMain || !trimmedCorrect.includes(trimmedMain)) {
    return [trimmedCorrect];
  }
  const mainIndex = trimmedCorrect.lastIndexOf(trimmedMain);
  if (mainIndex <= 0) {
    return [trimmedCorrect];
  }
  const aux = normalize(trimmedCorrect.slice(0, mainIndex));
  const main = normalize(trimmedCorrect.slice(mainIndex));
  if (!aux) {
    return [main];
  }
  return [aux, main];
}

function buildSentenceCloze(subject, blanksCount, objectEn, marker) {
  const blanks = Array.from({ length: blanksCount }, () => '_____');
  const pieces = [subject.en, ...blanks];
  if (objectEn) {
    pieces.push(objectEn);
  }
  if (marker?.en) {
    pieces.push(marker.en);
  }
  return ensureTrailingPeriod(pieces.join(' ').replace(/\s+/g, ' ').trim());
}

function composeExplanation({ marker, tense, correctAnswer }) {
  const fragments = [];
  if (marker?.en) {
    fragments.push(`La pista “${marker.en}” apunta a ${tense.toLowerCase()}.`);
  }
  const hint = PATTERN_HINTS[tense];
  if (hint) {
    fragments.push(`Siguiendo el patrón ${hint}`);
  }
  fragments.push(`la forma correcta es “${correctAnswer}”.`);
  return fragments.join(' ');
}

function ensureUnique(options, correct) {
  const unique = [];
  const seen = new Set();
  [...options].forEach((option) => {
    const normalized = normalize(option);
    if (!normalized || normalized.toLowerCase() === normalize(correct).toLowerCase()) {
      return;
    }
    if (!seen.has(normalized.toLowerCase())) {
      seen.add(normalized.toLowerCase());
      unique.push(normalized);
    }
  });
  return unique;
}

function buildResult(baseItem, { correct, mainPart, distractors }, rng) {
  const correctAnswer = normalize(correct);
  const blankParts = splitPhrase(correctAnswer, mainPart);
  const sentenceCloze = buildSentenceCloze(
    baseItem.meta.subject,
    blankParts.length,
    baseItem.meta.objectEn,
    baseItem.meta.marker
  );
  const clozeSegments = [baseItem.meta.subject.en, ...blankParts.map(() => '_____')];
  if (baseItem.meta.objectEn) {
    clozeSegments.push(baseItem.meta.objectEn);
  }
  if (baseItem.meta.marker?.en) {
    clozeSegments.push(baseItem.meta.marker.en);
  }

  const uniqueDistractors = ensureUnique(distractors, correctAnswer);
  if (uniqueDistractors.length < 3) {
    return null;
  }
  const trimmedDistractors = uniqueDistractors.slice(0, 3);
  const options = shuffle([correctAnswer, ...trimmedDistractors], rng);

  return {
    id: baseItem.id,
    sentenceCloze,
    clozeSegments,
    blankCount: blankParts.length,
    correctAnswer,
    correctAnswerParts: blankParts,
    distractors: trimmedDistractors,
    options,
    correctTense: baseItem.correctTense,
    explanation: composeExplanation({
      marker: baseItem.meta.marker,
      tense: baseItem.correctTense,
      correctAnswer,
    }),
    sentenceEs: baseItem.sentenceEs,
    sentenceEn: baseItem.sentenceEn,
  };
}

const CLOZE_BUILDERS = {
  'Present Simple': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = getPresentSimpleEn(subject, verb);
    const distractors = [
      `${subject.bePresent} ${verb.gerund}`,
      `${subject.havePresent} ${verb.participle}`,
      verb.past,
    ];
    return buildResult(item, { correct, mainPart: correct, distractors }, rng);
  },
  'Present Continuous': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = `${subject.bePresent} ${verb.gerund}`;
    const distractors = [
      getPresentSimpleEn(subject, verb),
      `${subject.havePresent} ${verb.participle}`,
      `${subject.havePresent} been ${verb.gerund}`,
    ];
    return buildResult(item, { correct, mainPart: verb.gerund, distractors }, rng);
  },
  'Present Perfect': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = `${subject.havePresent} ${verb.participle}`;
    const distractors = [
      `${subject.bePresent} ${verb.gerund}`,
      `${subject.havePresent} been ${verb.gerund}`,
      verb.past,
    ];
    return buildResult(item, { correct, mainPart: verb.participle, distractors }, rng);
  },
  'Present Perfect Continuous': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = `${subject.havePresent} been ${verb.gerund}`;
    const distractors = [
      `${subject.havePresent} ${verb.participle}`,
      `${subject.bePresent} ${verb.gerund}`,
      `had been ${verb.gerund}`,
    ];
    return buildResult(item, { correct, mainPart: verb.gerund, distractors }, rng);
  },
  'Simple Past': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = verb.past;
    const distractors = [
      `${subject.havePast} ${verb.participle}`,
      `${subject.bePast} ${verb.gerund}`,
      `${subject.havePresent} ${verb.participle}`,
    ];
    return buildResult(item, { correct, mainPart: verb.past, distractors }, rng);
  },
  'Past Continuous': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = `${subject.bePast} ${verb.gerund}`;
    const distractors = [
      `had been ${verb.gerund}`,
      `${subject.havePast} ${verb.participle}`,
      `${subject.bePresent} ${verb.gerund}`,
    ];
    return buildResult(item, { correct, mainPart: verb.gerund, distractors }, rng);
  },
  'Past Perfect Continuous': (item, rng) => {
    const { verb, subject } = item.meta;
    const correct = `had been ${verb.gerund}`;
    const distractors = [
      `${subject.bePast} ${verb.gerund}`,
      `${subject.havePast} ${verb.participle}`,
      `${subject.havePresent} been ${verb.gerund}`,
    ];
    return buildResult(item, { correct, mainPart: verb.gerund, distractors }, rng);
  },
  'Future (will)': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = `will ${verb.base}`;
    const distractors = [
      `${subject.goingToEn} ${verb.base}`,
      `${subject.bePresent} ${verb.gerund}`,
      `${subject.havePresent} ${verb.participle}`,
    ];
    return buildResult(item, { correct, mainPart: verb.base, distractors }, rng);
  },
  'Be going to': (item, rng) => {
    const { subject, verb } = item.meta;
    const correct = `${subject.goingToEn} ${verb.base}`;
    const distractors = [
      `will ${verb.base}`,
      `${subject.bePresent} ${verb.gerund}`,
      `${subject.havePresent} ${verb.participle}`,
    ];
    return buildResult(item, { correct, mainPart: verb.base, distractors }, rng);
  },
};

export function buildClozeItem(baseItem, rng) {
  const builder = CLOZE_BUILDERS[baseItem.correctTense];
  if (!builder) {
    return null;
  }
  if (!baseItem.meta?.subject || !baseItem.meta?.verb) {
    return null;
  }
  return builder(baseItem, rng);
}
