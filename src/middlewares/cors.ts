import cors from 'cors';
import config from 'config/config';
import { UnauthorizedError } from '@utils/custom-errors';

const AllowedOrigins: string[] = ['http://localhost:3000', 'http://localhost:4200', 'https://skq4m71g-4200.use2.devtunnels.ms'];

interface ICorsMiddlewareOptions {
  allowedOrigins?: string[];
}

export const corsMiddleware = ({ allowedOrigins = AllowedOrigins }: ICorsMiddlewareOptions = {}) =>
  cors({
    origin: (origin: string | undefined, callback) => {
      if (config.nodeEnvironment !== 'development') {
        if (origin && allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new UnauthorizedError(`CORS error: Origin ${origin} is not allowed.`));
      }
      return callback(null, true);
    },
    credentials: true,
  });
