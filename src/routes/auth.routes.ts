import { validateRequest } from '@middlewares/validate-request';
import { validateLogin, validateUser } from '@schemas/user.schema';
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
  authRouter.delete('/logout', authController.logout);

  return authRouter;
};
