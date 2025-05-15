import { NextFunction, Request, Response } from 'express';
import { ZodIssue } from 'zod';

/**
 * Middleware to validate request body using Zod schemas.
 * @param validateMethod - The Zod validation method to use.
 * @returns A middleware function that validates the request body.
 */
export const validateRequest =
  (validateMethod: Function) =>
  (req: Request, res: Response, next: NextFunction): void | any => {
    const validationResult = validateMethod(req.body);
    if (!validationResult.success) {
      const errorMessagesArray = JSON.parse(validationResult.error.message);
      const errorMessages = errorMessagesArray.map((error: ZodIssue) => error.message).join(', ');
      return res.status(422).json({ message: errorMessages });
    }

    next();
  };
