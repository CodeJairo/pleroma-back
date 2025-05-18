import express from 'express';
import { AppDependencies } from 'types';
import { createContractRouter, createBudgetInfoRouter, createAuthRouter } from '@routes/index';
import { limiter, corsMiddleware, errorHandler } from '@middlewares/index';
import cookieParser from 'cookie-parser';
import { swaggerUi, swaggerSpec } from 'config/swagger';

export const createApp = ({ contractController, authController, authMiddleware, budgetController }: AppDependencies) => {
  const app = express();

  app.use((req, res, next) => {
    console.log(`Petición recibida: ${req.method}`);
    // Cuando la respuesta termine, muestra el status
    res.on('finish', () => {
      console.log(`Status de la respuesta: ${res.statusCode}`);
    });
    next();
  });

  app.use(corsMiddleware());
  app.use(limiter);
  app.use(express.json());
  app.disable('x-powered-by');
  app.use(cookieParser());
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use('/contract', createContractRouter({ contractController, authMiddleware }));
  app.use('/auth', createAuthRouter({ authController, authMiddleware }));
  app.use('/budget', createBudgetInfoRouter({ authMiddleware, budgetController }));
  app.use(errorHandler);
  return app;
};
