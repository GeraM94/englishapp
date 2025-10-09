import { useMemo, useState } from 'react';

function renderSentence(sentence) {
  const parts = sentence.split('_____');
  return parts.flatMap((part, index) => {
    const nodes = [];
    if (part) {
      nodes.push(
        <span key={`text-${index}`} className="cloze-text">
          {part}
        </span>
      );
    }
    if (index < parts.length - 1) {
      nodes.push(
        <span key={`blank-${index}`} className="cloze-blank" aria-hidden="true">
          _____
        </span>
      );
      nodes.push(
        <span key={`blank-label-${index}`} className="sr-only">
          espacio en blanco
        </span>
      );
    }
    return nodes;
  });
}

export function ClozeCard({ item, response, onAnswer }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const isAnswered = Boolean(response);

  const ariaLabel = useMemo(
    () => item.sentenceCloze.replace(/_____/g, 'espacio en blanco'),
    [item.sentenceCloze]
  );

  const handleSelect = (option) => {
    if (isAnswered) return;
    const correct = option === item.correctAnswer;
    onAnswer({
      itemId: item.id,
      choice: option,
      correct,
    });
  };

  const getChoiceClass = (option) => {
    if (!isAnswered) return 'choice';
    if (option === item.correctAnswer) {
      return 'choice correct';
    }
    if (response?.chosenOption === option) {
      return 'choice incorrect';
    }
    return 'choice disabled';
  };

  return (
    <article className="cloze-card">
      <header className="cloze-card__header">
        <p className="cloze-sentence" lang="en" aria-label={ariaLabel}>
          {renderSentence(item.sentenceCloze)}
        </p>
        {item.sentenceEs && (
          <button
            type="button"
            className="link"
            onClick={() => setShowTranslation((value) => !value)}
            aria-expanded={showTranslation}
          >
            {showTranslation ? 'Ocultar traducción' : 'Mostrar traducción'}
          </button>
        )}
        {showTranslation && item.sentenceEs && (
          <p className="translation" lang="es">
            {item.sentenceEs}
          </p>
        )}
      </header>
      <div className="choice-group" role="radiogroup" aria-label="Opciones de respuesta">
        {item.options.map((option) => {
          const checked = response?.chosenOption === option;
          return (
            <button
              key={option}
              type="button"
              className={getChoiceClass(option)}
              role="radio"
              aria-checked={checked}
              onClick={() => handleSelect(option)}
              disabled={isAnswered}
            >
              <span className="choice__text">{option}</span>
            </button>
          );
        })}
      </div>
      {isAnswered && (
        <footer className="cloze-feedback" aria-live="polite">
          <p className={response.correct ? 'success' : 'error'}>
            {response.correct
              ? '¡Correcto!'
              : `Incorrecto. La respuesta correcta es “${item.correctAnswer}”.`}
          </p>
          <p className="explanation">{item.explanation}</p>
        </footer>
      )}
    </article>
  );
}
