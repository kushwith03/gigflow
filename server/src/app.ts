import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler, notFound } from './middlewares/error.middleware.js';
import { env } from './config/env.js';
import { sendResponse } from './utils/response.js';
import authRoutes from './routes/auth.routes.js';
import leadRoutes from './routes/lead.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true
}));
app.use(helmet());
if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
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

app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
