import { CustomError } from './custom-errors';
import { Response } from 'express';

export function handleError(error: unknown, res: Response) {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
}
