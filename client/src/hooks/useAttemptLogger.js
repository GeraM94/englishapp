import { useMutation } from '@tanstack/react-query';
import { submitAttempt } from '../api/generator.js';

export function useAttemptLogger() {
  return useMutation({
    mutationFn: submitAttempt,
  });
}
