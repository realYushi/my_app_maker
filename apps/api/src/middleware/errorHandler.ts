import { Request, Response, NextFunction } from 'express';
import { AIServiceError } from '../services/ai.service';

export interface ApiError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: ApiError | AIServiceError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle AI service errors specifically
  if (err instanceof AIServiceError) {
    statusCode = err.statusCode;
    message = statusCode >= 500 ? 'Failed to process request' : err.message;
  } else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    message = err.message || 'Internal Server Error';
  }

  // Log error details for debugging (but don't expose sensitive info to client)
  console.error(`Error ${statusCode}: ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  res.status(statusCode).json({
    error: statusCode >= 500 ? 'Internal Server Error' : 'Bad Request',
    message: statusCode >= 500 ? 'Failed to process request' : message
  });
};