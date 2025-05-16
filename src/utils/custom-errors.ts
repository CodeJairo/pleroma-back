/**
 * Custom error class for handling HTTP errors.
 */
export class CustomError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Subclase para errores de validación
export class ValidationError extends CustomError {
  constructor(message = 'Validation Error') {
    super(400, message);
  }
}

/**
 * HTTP status code 409
 * @param message - Optional. Defaults to 'Conflict error'.
 */
export class ConflictError extends CustomError {
  constructor(message = 'Conflict error') {
    super(409, message);
  }
}

/**
 * HTTP status code 500
 * @param message - Optional. Defaults to 'Internal server error'.
 */
export class InternalServerError extends CustomError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}

/**
 * HTTP status code 400
 * @param message - Optional. Defaults to 'Bad request'.
 */
export class BadRequestError extends CustomError {
  constructor(message = 'Bad request') {
    super(400, message);
  }
}

/**
 * HTTP status code 401
 * @param message - Optional. Defaults to 'Authentication failed'.
 */
export class UnauthorizedError extends CustomError {
  constructor(message = 'Authentication failed') {
    super(401, message);
  }
}

/**
 * HTTP status code 403
 * @param message - Optional. Defaults to 'Access denied'.
 */
export class ForbiddenError extends CustomError {
  constructor(message = 'Access denied') {
    super(403, message);
  }
}

/**
 * HTTP status code 404
 * @param message - Optional. Defaults to 'Resource not found'.
 */
export class NotFoundError extends CustomError {
  constructor(message = 'Resource not found') {
    super(404, message);
  }
}
