import { z } from 'zod';
import Attempt from '../models/Attempt.js';
import { isPersistenceEnabled } from '../utils/persistence.js';

const querySchema = z.object({
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional(),
});

export async function handleStats(req, res) {
  try {
    if (!isPersistenceEnabled()) {
      res.status(200).json({
        summary: {
          totalAttempts: 0,
          correctAttempts: 0,
          accuracy: 0,
        },
        byTense: {},
        range: null,
        message: 'Sin conexión a base de datos. Las estadísticas no están disponibles.',
      });
      return;
    }

    const parsed = querySchema.parse(req.query);
    const now = new Date();
    const fromDate = parsed.from ?? new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const toDate = parsed.to ?? now;

    const matchStage = {
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    };

    const grouped = await Attempt.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: '$correctTense',
          attempts: { $sum: 1 },
          correct: {
            $sum: {
              $cond: [{ $eq: ['$correct', true] }, 1, 0],
            },
          },
        },
      },
    ]);

    const byTense = grouped.reduce((acc, entry) => {
      const accuracy = entry.attempts ? entry.correct / entry.attempts : 0;
      acc[entry._id] = {
        attempts: entry.attempts,
        correct: entry.correct,
        accuracy,
      };
      return acc;
    }, {});

    const totalAttempts = grouped.reduce((sum, entry) => sum + entry.attempts, 0);
    const correctAttempts = grouped.reduce((sum, entry) => sum + entry.correct, 0);
    const accuracy = totalAttempts ? correctAttempts / totalAttempts : 0;

    res.json({
      summary: {
        totalAttempts,
        correctAttempts,
        accuracy,
      },
      byTense,
      range: { from: fromDate.toISOString(), to: toDate.toISOString() },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ message: 'Parámetros inválidos', issues: error.issues });
      return;
    }

    console.error('Error fetching stats', error);
    res.status(500).json({ message: 'Error al obtener estadísticas' });
  }
}
