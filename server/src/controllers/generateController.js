import { z } from 'zod';
import { generateItems } from '../services/generator/index.js';

const requestSchema = z.object({
  tenses: z.array(z.string()).nonempty('Selecciona al menos un tiempo verbal'),
  count: z.number().int().min(1).max(40).default(10),
  seed: z.string().optional(),
  mode: z.enum(['multiple-choice', 'cloze']).default('multiple-choice'),
});

export async function handleGenerate(req, res) {
  try {
    const { tenses, count, seed, mode } = requestSchema.parse(req.body);
    const result = generateItems({ tenses, count, seed, mode });
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Solicitud inválida', issues: error.issues });
      return;
    }

    console.error('Error generating items', error);
    res.status(500).json({ message: 'Error interno al generar oraciones' });
  }
}
