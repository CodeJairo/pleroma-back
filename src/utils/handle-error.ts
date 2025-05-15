import { CustomError } from './custom-errors';
import { Response } from 'express';

/**
 * Handles errors by sending an appropriate HTTP response based on the error type.
 *
 * @param error - The error object to handle. It can be of any type.
 * @param res - The HTTP response object used to send the response.
 *
 * @remarks
 * If the error is an instance of `CustomError`, it sends a response with the status code
 * and message defined in the `CustomError`. Otherwise, it sends a generic 500 Internal
 * Server Error response.
 */
export function handleError(error: unknown, res: Response) {
  if (error instanceof CustomError) {
    return res.status(error.statusCode).json({ message: error.message });
  }
  return res.status(500).json({ message: 'Internal Server Error' });
}
