import express from 'express';
import { AppDependencies } from 'types';
import { createContractRouter, createBudgetInfoRouter, createAuthRouter } from '@routes/index';
import { limiter } from '@middlewares/index';
import cookieParser from 'cookie-parser';

export const createApp = ({ contractController, authController, authMiddleware, budgetController }: AppDependencies) => {
  const app = express();
  app.use(limiter);
  app.use(express.json());
  app.disable('x-powered-by');
  app.use(cookieParser());

  app.use('/contract', createContractRouter({ contractController, authMiddleware }));
  app.use('/auth', createAuthRouter({ authController, authMiddleware }));
  app.use('/budget', createBudgetInfoRouter({ authMiddleware, budgetController }));

  return app;
};
