import { useMemo, useState } from 'react';
import { useGenerateExercises } from './hooks/useGenerateExercises.js';
import { useAttemptLogger } from './hooks/useAttemptLogger.js';
import { TenseSelector } from './components/TenseSelector.jsx';
import { ExerciseList } from './components/ExerciseList.jsx';
import { ProgressSummary } from './components/ProgressSummary.jsx';
import { computeProgress } from './utils/progress.js';

function useSelectedTenses(initial = []) {
  const [selected, setSelected] = useState(initial);

  const toggle = (tense) => {
    setSelected((prev) =>
      prev.includes(tense) ? prev.filter((item) => item !== tense) : [...prev, tense]
    );
  };

  return [selected, toggle, setSelected];
}

export default function App() {
  const [selectedTenses, toggleTense, setSelectedTenses] = useSelectedTenses([]);
  const [count, setCount] = useState(10);
  const [items, setItems] = useState([]);
  const [responses, setResponses] = useState({});
  const [sessionMeta, setSessionMeta] = useState(null);

  const generateMutation = useGenerateExercises();
  const attemptLogger = useAttemptLogger();

  const handleGenerate = async () => {
    if (!selectedTenses.length) return;
    try {
      const data = await generateMutation.mutateAsync({ tenses: selectedTenses, count });
      setItems(data.items);
      setResponses({});
      setSessionMeta({ tenses: data.tenses, seed: data.seed, total: data.items.length });
      setSelectedTenses(data.tenses);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswer = ({ itemId, chosenTense, correct }) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: { chosenTense, correct },
    }));

    const item = items.find((exercise) => exercise.id === itemId);
    if (!item) return;

    attemptLogger.mutate({
      itemId,
      chosenTense,
      correct,
      correctTense: item.correctTense,
      tensesSelected: sessionMeta?.tenses ?? selectedTenses,
      batchSeed: sessionMeta?.seed,
    });
  };

  const progress = useMemo(() => computeProgress(items, responses), [items, responses]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>Entrenador de tiempos verbales</h1>
        <p>Practica identificando el tiempo verbal correcto en cada oración.</p>
      </header>
      <ProgressSummary {...progress} />
      <div className="layout">
        <TenseSelector
          selectedTenses={selectedTenses}
          onToggle={toggleTense}
          count={count}
          onCountChange={setCount}
          onGenerate={handleGenerate}
          isLoading={generateMutation.isPending}
        />
        <main className="content" aria-live="polite">
          {generateMutation.isError && (
            <div role="alert" className="error-message">
              Ocurrió un problema al generar las oraciones. Intenta de nuevo.
            </div>
          )}
          <ExerciseList items={items} responses={responses} onAnswer={handleAnswer} />
          {items.length > 0 && (
            <button type="button" className="secondary" onClick={handleGenerate}>
              Generar más
            </button>
          )}
        </main>
      </div>
    </div>
  );
}
