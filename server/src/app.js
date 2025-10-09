import express from 'express';
import cors from 'cors';
import generateRoutes from './routes/generateRoutes.js';
import statsRoutes from './routes/statsRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', generateRoutes);
app.use('/api', statsRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default app;
