import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/error.middleware';
import { env } from './config/env';
import { sendResponse } from './utils/response';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health Route
app.get('/health', (req, res) => {
  sendResponse(res, {
    message: 'GigFlow API is healthy',
    data: {
      status: 'up',
      environment: env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// Routes Placeholder
// app.use('/api/auth', authRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
