import { useMutation } from '@tanstack/react-query';
import { generateExercises } from '../api/generator.js';

export function useGenerateExercises() {
  return useMutation({
    mutationFn: generateExercises,
  });
}
