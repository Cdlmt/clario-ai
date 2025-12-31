import express from 'express';
import transcribeRoute from './routes/transcribe.route';
import analyzeRoute from './routes/analyze.route';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/transcribe', transcribeRoute);
app.use('/analyze', analyzeRoute);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
