import 'dotenv/config';
import express from 'express';
import './lib/config';
import transcribeRoute from './routes/transcribe.route';
import analyzeRoute from './routes/analyze.route';
import questionRoute from './routes/question.route';
import onboardingRoute from './routes/onboarding.route';
import sessionsRoute from './routes/sessions.route';
import statisticsRoute from './routes/statistics.route';
import membershipRoute from './routes/membership.route';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// Routes
app.use('/transcribe', transcribeRoute);
app.use('/analyze', analyzeRoute);
app.use('/questions', questionRoute);
app.use('/onboarding', onboardingRoute);
app.use('/sessions', sessionsRoute);
app.use('/statistics', statisticsRoute);
app.use('/membership', membershipRoute);

app.listen(parseInt(PORT as string, 10), '0.0.0.0', () => {
  console.log(
    `Server running on http://0.0.0.0:${PORT} (accessible on network)`
  );
  console.log(`Local access: http://localhost:${PORT}`);
});
