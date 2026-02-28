import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './lib/env.js';
import { authRouter } from './routes/auth.js';
import { metaRouter } from './routes/meta.js';
import { cardsRouter } from './routes/cards.js';

const app = express();

app.use(cors({ origin: env.CORS_ORIGIN === '*' ? true : env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_, res) => {
  res.json({ success: true, message: 'Backend is running' });
});

app.use('/api/auth', authRouter);
app.use('/api/meta', metaRouter);
app.use('/api', cardsRouter);

app.use((_, res) => {
  res.status(404).json({ success: false, message: 'Not found' });
});

app.use((error, _, res, __) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

app.listen(env.PORT, () => {
  console.log(`API server listening on http://localhost:${env.PORT}`);
});
