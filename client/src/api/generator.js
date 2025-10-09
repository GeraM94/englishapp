import { apiClient } from './client.js';

export async function generateExercises({ tenses, count }) {
  const response = await apiClient.post('/generate', {
    tenses,
    count,
  });
  return response.data;
}

export async function submitAttempt(payload) {
  try {
    await apiClient.post('/attempt', payload);
  } catch (error) {
    // Persistencia opcional: ignoramos errores silenciosamente.
    console.warn('No se pudo registrar el intento', error.message);
  }
}
