import { Request, Response, NextFunction } from 'express';

/**
 * Global Error Handler Middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Handle validation errors
  if (err.message.includes('required') || err.message.includes('must')) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }

  // Handle not found errors
  if (err.message.includes('not found')) {
    return res.status(404).json({
      success: false,
      error: err.message,
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
};
