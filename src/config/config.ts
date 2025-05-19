import dotenv from 'dotenv';
import env from 'env-var';

dotenv.config();

const config = {
  port: env.get('PORT').default(3000).asPortNumber(),
  redisUrl: env.get('REDIS_URL').default('redis://localhost:6379').asString(),
  jwtSecret: env.get('JWT_SECRET').asString(),
  nodeEnvironment: env.get('NODE_ENV').asString(),
  apiUrl: env.get('API_URL').default('http://localhost:3000').asString(),
  clientCookieKey: env.get('CLIENT_COOKIE_KEY').default('e3Xe2F0RPRih').asString(),
  serverCookieKey: env.get('SERVER_COOKIE_KEY').default('0wNpuO91jiPX').asString(),
};

export default config;
