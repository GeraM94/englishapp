export function ProgressSummary({ total, answered, correct, accuracy }) {
  return (
    <header className="progress" aria-live="polite">
      <div>
        <strong>{correct}</strong>
        <span>aciertos</span>
      </div>
      <div>
        <strong>{answered}</strong>
        <span>respondidas</span>
      </div>
      <div>
        <strong>{total}</strong>
        <span>total</span>
      </div>
      <div className="accuracy">
        <span>Precisión</span>
        <span aria-label={`Precisión ${accuracy}%`}>{accuracy}%</span>
      </div>
      <div className="progress-bar" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={answered}>
        <div className="progress-fill" style={{ width: total ? `${(answered / total) * 100}%` : '0%' }} />
      </div>
    </header>
  );
}
