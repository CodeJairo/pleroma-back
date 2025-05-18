import { CustomError } from '@utils/custom-errors';
import { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }
  res.status(500).json({ message: 'Internal Server Error' });
  return;
};
