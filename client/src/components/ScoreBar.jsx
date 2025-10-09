import { forwardRef } from 'react';

export const ScoreBar = forwardRef(function ScoreBar(
  { total, answered, correct, accuracy },
  ref
) {
  const answeredLabel = `${answered} de ${total}`;
  return (
    <section
      ref={ref}
      className="score-bar"
      role="status"
      aria-live="polite"
      aria-label="Marcador de progreso"
    >
      <div className="score-bar__metrics">
        <div className="score-bar__metric" data-metric="correct">
          <span className="score-bar__label">Aciertos</span>
          <strong className="score-bar__value">{correct}</strong>
        </div>
        <div className="score-bar__metric" data-metric="answered">
          <span className="score-bar__label">Respondidas</span>
          <strong className="score-bar__value" aria-label={`Respondidas ${answeredLabel}`}>
            {answered}
          </strong>
        </div>
        <div className="score-bar__metric" data-metric="total">
          <span className="score-bar__label">Total</span>
          <strong className="score-bar__value">{total}</strong>
        </div>
        <div className="score-bar__metric" data-metric="accuracy">
          <span className="score-bar__label">Precisión</span>
          <strong className="score-bar__value" aria-label={`Precisión ${accuracy}%`}>
            {accuracy}%
          </strong>
        </div>
      </div>
      <div
        className="score-bar__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
      >
        <div
          className="score-bar__progress-fill"
          style={{ width: total ? `${Math.min(100, (answered / total) * 100)}%` : '0%' }}
        />
      </div>
    </section>
  );
});
