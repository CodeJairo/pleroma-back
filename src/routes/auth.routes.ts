import { validateRequest } from '@middlewares/index';
import { validateLogin, validateUpdateUser, validateUpdateUserAsAdmin, validateUser } from '@schemas/index';
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
  authRouter.patch('/update', authMiddleware.isAuthenticated, validateRequest(validateUpdateUser), authController.updateUser);
  authRouter.patch('/update/admin/:id', authMiddleware.isAdmin, validateRequest(validateUpdateUserAsAdmin), authController.updateUser);
  authRouter.post('/refresh-token', authMiddleware.isAuthenticated, authController.refreshToken);
  authRouter.post('/logout', authController.logout);
  authRouter.delete('/delete/:id', authMiddleware.isAdmin, authController.deleteUser);

  return authRouter;
};
