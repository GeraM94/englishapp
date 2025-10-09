import { ExerciseCard } from './ExerciseCard.jsx';

export function ExerciseList({ items, responses, onAnswer }) {
  if (!items.length) {
    return (
      <section className="empty-state" aria-live="polite">
        <p>Selecciona al menos un tiempo y presiona “Generar” para comenzar.</p>
      </section>
    );
  }

  return (
    <section className="exercise-list" aria-live="polite">
      {items.map((item) => (
        <ExerciseCard key={item.id} item={item} response={responses[item.id]} onAnswer={onAnswer} />
      ))}
    </section>
  );
}
