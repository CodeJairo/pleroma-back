import express from 'express';
import { AppDependencies } from 'types';
import config from './config/config';
import { createContractRouter } from '@routes/index';
import { limiter } from '@middlewares/rate-limit';
import { createAuthRouter } from '@routes/auth.routes';
import cookieParser from 'cookie-parser';

export const createApp = ({ contractController, authController, authMiddleware }: AppDependencies) => {
  const app = express();
  app.use(limiter);
  app.use(express.json());
  app.disable('x-powered-by');
  app.use(cookieParser());

  app.use('/contract', createContractRouter({ contractController, authMiddleware }));
  app.use('/auth', createAuthRouter({ authController, authMiddleware }));

  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
};
