import { z } from 'zod';
import Attempt from '../models/Attempt.js';
import { isPersistenceEnabled } from '../utils/persistence.js';

const attemptSchema = z.object({
  itemId: z.string(),
  chosenTense: z.string(),
  correctTense: z.string(),
  correct: z.boolean(),
  tensesSelected: z.array(z.string()).optional(),
  batchSeed: z.string().optional(),
});

export async function handleAttempt(req, res) {
  try {
    const payload = attemptSchema.parse(req.body);

    if (!isPersistenceEnabled()) {
      res.status(202).json({ message: 'Attempt received but persistence is disabled.' });
      return;
    }

    await Attempt.create(payload);
    res.status(201).json({ message: 'Attempt stored' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Solicitud inválida', issues: error.issues });
      return;
    }

    console.error('Error storing attempt', error);
    res.status(500).json({ message: 'Error al guardar el intento' });
  }
}
