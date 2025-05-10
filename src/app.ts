import express from 'express';
import { AppDependencies } from 'types';
import config from './config/config';
import { createContractRouter } from '@routes/index';
import { limiter } from '@middlewares/rate-limit';

export const createApp = ({ contractController }: AppDependencies) => {
  const app = express();
  app.use(limiter);
  app.use(express.json());
  app.disable('x-powered-by');

  app.use('/contract', createContractRouter({ contractController }));

  app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
  });
};
