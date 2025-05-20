import { rateLimit } from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '@utils/redis-client';

export const limiter = rateLimit({
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  windowMs: 15 * 60 * 1000, // 15 minutos
  limit: 1000, // Limita cada IP a 100 solicitudes por ventana de tiempo
  standardHeaders: true, // Devuelve la información de rate limit en los headers `RateLimit-*`
  legacyHeaders: false, // Desactiva los headers `X-RateLimit-*`
  message: 'Has realizado demasiadas solicitudes. Por favor, intenta de nuevo más tarde.',
});
