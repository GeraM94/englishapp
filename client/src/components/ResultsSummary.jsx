export function ResultsSummary({ total, correct, accuracy }) {
  return (
    <section className="results-summary" aria-live="polite">
      <h3>Resumen de la tanda</h3>
      <p>
        Acertaste <strong>{correct}</strong> de <strong>{total}</strong> oraciones.
      </p>
      <p>
        Tu precisión fue del <strong>{accuracy}%</strong>. ¡Sigue practicando para dominar los
        tiempos verbales!
      </p>
    </section>
  );
}
