import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ClozeCard } from '../src/components/ClozeCard.jsx';

const baseItem = {
  id: 'item-1',
  sentenceCloze: 'I _____ _____ English lately.',
  sentenceEs: 'He estado aprendiendo inglés últimamente.',
  options: ['am learning', 'have been learning', 'have learned', 'had been learning'],
  correctAnswer: 'have been learning',
  explanation: '“lately” indica Present Perfect Continuous con have/has been + verbo en -ing.',
};

describe('ClozeCard', () => {
  it('blocks further answers and shows explanation after selecting an option', async () => {
    const user = userEvent.setup();
    const handleAnswer = vi.fn();
    render(<ClozeCard item={baseItem} response={undefined} onAnswer={handleAnswer} />);

    const options = screen.getAllByRole('radio');
    expect(options).toHaveLength(4);

    await user.click(screen.getByRole('radio', { name: 'am learning' }));

    expect(handleAnswer).toHaveBeenCalledWith({
      itemId: 'item-1',
      choice: 'am learning',
      correct: false,
    });
  });

  it('renders correct and incorrect states when response is provided', () => {
    const response = { chosenOption: 'am learning', correct: false };
    render(<ClozeCard item={baseItem} response={response} onAnswer={() => {}} />);

    const correctOption = screen.getByRole('radio', { name: 'have been learning' });
    const wrongOption = screen.getByRole('radio', { name: 'am learning' });

    expect(correctOption).toHaveClass('choice', 'correct');
    expect(wrongOption).toHaveClass('choice', 'incorrect');
    expect(correctOption).toBeDisabled();
    expect(screen.getByText(/la respuesta correcta es/i)).toBeInTheDocument();
    expect(screen.getByText(baseItem.explanation)).toBeInTheDocument();
  });
});
