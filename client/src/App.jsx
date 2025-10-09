import { useMemo, useRef, useState } from 'react';
import { useGenerateExercises } from './hooks/useGenerateExercises.js';
import { useAttemptLogger } from './hooks/useAttemptLogger.js';
import { AppHeader } from './components/AppHeader.jsx';
import { ScoreBar } from './components/ScoreBar.jsx';
import { GeneratorPanel } from './components/GeneratorPanel.jsx';
import { ExerciseList } from './components/ExerciseList.jsx';
import { ResultsSummary } from './components/ResultsSummary.jsx';
import { useStickyOffsets } from './hooks/useStickyOffsets.js';
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
  const mode = 'cloze';

  const appRef = useRef(null);
  const { headerRef, scoreBarRef } = useStickyOffsets(appRef);

  const generateMutation = useGenerateExercises();
  const attemptLogger = useAttemptLogger();

  const handleGenerate = async () => {
    if (!selectedTenses.length) return;
    try {
      const data = await generateMutation.mutateAsync({ tenses: selectedTenses, count, mode });
      setItems(data.items);
      setResponses({});
      setSessionMeta({
        tenses: data.tenses,
        seed: data.seed,
        total: data.items.length,
        mode: data.mode,
      });
      setSelectedTenses(data.tenses);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAnswer = ({ itemId, choice, correct }) => {
    setResponses((prev) => ({
      ...prev,
      [itemId]: { chosenOption: choice, correct },
    }));

    const item = items.find((exercise) => exercise.id === itemId);
    if (!item) return;

    attemptLogger.mutate({
      itemId,
      chosenTense: choice,
      correct,
      correctTense: item.correctTense,
      tensesSelected: sessionMeta?.tenses ?? selectedTenses,
      batchSeed: sessionMeta?.seed,
    });
  };

  const progress = useMemo(() => computeProgress(items, responses), [items, responses]);
  const allAnswered = progress.total > 0 && progress.answered === progress.total;

  return (
    <div className="app" ref={appRef} data-layout="grid-rows">
      <AppHeader ref={headerRef} />
      <ScoreBar
        ref={scoreBarRef}
        total={progress.total}
        answered={progress.answered}
        correct={progress.correct}
        accuracy={progress.accuracy}
      />
      <div className="layout">
        <GeneratorPanel
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
          {allAnswered && <ResultsSummary {...progress} />}
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
