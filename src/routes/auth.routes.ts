import { validateRequest } from '@middlewares/validate-request';
import { validateLogin, validateUser } from '@schemas/user.schema';
import { Router } from 'express';
import { IAuthController } from 'types';

interface AuthRouterDependencies {
  authController: IAuthController;
}

export const createAuthRouter = ({ authController }: AuthRouterDependencies) => {
  const authRouter = Router();

  authRouter.post('/register', validateRequest(validateUser), authController.register);
  authRouter.post('/login', validateRequest(validateLogin), authController.login);
  authRouter.post('/logout', authController.logout);

  return authRouter;
};
