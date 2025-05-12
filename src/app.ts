import express from 'express';
import { AppDependencies } from 'types';
import config from './config/config';
import { createContractRouter } from '@routes/index';
import { limiter } from '@middlewares/rate-limit';
import { createAuthRouter } from '@routes/auth.routes';

export const createApp = ({ contractController, authController }: AppDependencies) => {
  const app = express();
  app.use(limiter);
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/contract', createContractRouter({ contractController }));
  app.use('/auth', createAuthRouter({ authController }));

  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
};
