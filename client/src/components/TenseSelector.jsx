import { TENSE_OPTIONS } from '../utils/tenses.js';

export function TenseSelector({ selectedTenses, onToggle, count, onCountChange, onGenerate, isLoading }) {
  return (
    <section className="panel" aria-label="Selector de tiempos verbales">
      <h2>Selecciona tiempos verbales</h2>
      <fieldset>
        <legend className="sr-only">Tiempos disponibles</legend>
        <div className="checkbox-grid">
          {TENSE_OPTIONS.map((tense) => {
            const checked = selectedTenses.includes(tense);
            return (
              <label key={tense} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => onToggle(tense)}
                  aria-checked={checked}
                />
                <span>{tense}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
      <div className="control-row">
        <label htmlFor="exercise-count">Cantidad de oraciones</label>
        <select
          id="exercise-count"
          value={count}
          onChange={(event) => onCountChange(Number(event.target.value))}
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      <button
        type="button"
        className="primary"
        onClick={onGenerate}
        disabled={isLoading || selectedTenses.length === 0}
      >
        {isLoading ? 'Generando…' : 'Generar'}
      </button>
    </section>
  );
}
