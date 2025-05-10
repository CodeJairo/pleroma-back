export class CustomError extends Error {
  public readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends CustomError {
  constructor(message = 'Validation Error') {
    super(400, message);
  }
}

// Subclase para errores internos del servidor
export class InternalServerError extends CustomError {
  constructor(message = 'Internal server error') {
    super(500, message);
  }
}
