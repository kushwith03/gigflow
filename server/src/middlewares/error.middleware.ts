import { type Request, type Response, type NextFunction } from 'express';
import { AppError } from '../utils/errors.js';
import { env } from '../config/env.js';

interface ExtendedError extends Error {
  statusCode?: number;
  status?: string;
  code?: number;
  keyValue?: Record<string, string>;
  isOperational?: boolean;
}

export const errorHandler = (
  err: ExtendedError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Handle Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    if (field) {
      err.message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
      err.statusCode = 400;
    }
  }

  if (env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      stack: err.stack,
      error: err,
    });
  } else {
    // Production
    if (err.isOperational) {
      res.status(err.statusCode).json({
        success: false,
        message: err.message,
      });
    } else {
      console.error('Unexpected Error:', err);
      res.status(500).json({
        success: false,
        message: 'Something went very wrong!',
      });
    }
  }
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};
