import { validateRequest } from '@middlewares/index';
import { validateLogin, validateUser } from '@schemas/index';
import { Router } from 'express';
import { IAuthController, IAuthMiddleware } from 'types';

interface AuthRouterDependencies {
  authController: IAuthController;
  authMiddleware: IAuthMiddleware;
}

export const createAuthRouter = ({ authController, authMiddleware }: AuthRouterDependencies) => {
  const authRouter = Router();

  authRouter.post('/register', authMiddleware.isAdmin, validateRequest(validateUser), authController.register);
  authRouter.post('/login', validateRequest(validateLogin), authController.login);
  authRouter.post('/refresh-token', authMiddleware.isAuthenticated, authController.refreshToken);
  authRouter.delete('/logout', authController.logout);

  return authRouter;
};
