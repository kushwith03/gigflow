import { Response } from 'express';

export const sendResponse = (
  res: Response,
  {
    statusCode = 200,
    success = true,
    message,
    data,
    meta,
  }: {
    statusCode?: number;
    success?: boolean;
    message?: string;
    data?: unknown;
    meta?: unknown;
  }
) => {
  return res.status(statusCode).json({
    success,
    message,
    data,
    meta,
  });
};
