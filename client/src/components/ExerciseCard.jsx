import { useState } from 'react';

export function ExerciseCard({ item, response, onAnswer }) {
  const [showTranslation, setShowTranslation] = useState(false);
  const isAnswered = Boolean(response);

  const handleOptionClick = (option) => {
    if (isAnswered) return;
    const correct = option === item.correctTense;
    onAnswer({
      itemId: item.id,
      chosenTense: option,
      correct,
    });
  };

  const getOptionClass = (option) => {
    if (!isAnswered) return 'option';
    if (option === item.correctTense) {
      return 'option correct';
    }
    if (response?.chosenTense === option) {
      return 'option incorrect';
    }
    return 'option disabled';
  };

  return (
    <article className="exercise-card">
      <header>
        <p className="sentence" lang="en">{item.sentenceEn}</p>
        <button
          type="button"
          className="link"
          onClick={() => setShowTranslation((value) => !value)}
          aria-expanded={showTranslation}
        >
          {showTranslation ? 'Ocultar traducción' : 'Mostrar traducción'}
        </button>
        {showTranslation && (
          <p className="translation" lang="es">{item.sentenceEs}</p>
        )}
      </header>
      <div className="options" role="group" aria-label="Opciones de tiempo verbal">
        {item.options.map((option) => (
          <button
            key={option}
            type="button"
            className={getOptionClass(option)}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
          >
            {option}
          </button>
        ))}
      </div>
      {isAnswered && (
        <footer className="feedback" role="status">
          <p className={response.correct ? 'success' : 'error'}>
            {response.correct ? '¡Correcto!' : `Incorrecto. La respuesta correcta es ${item.correctTense}.`}
          </p>
          <p className="rationale">{item.rationale}</p>
        </footer>
      )}
    </article>
  );
}
