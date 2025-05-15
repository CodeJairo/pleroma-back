import { validateRequest } from '@middlewares/index';
import { validateBudgetInformation } from '@schemas/index';
import { Router } from 'express';
import { IAuthMiddleware, IBudgetController } from 'types';

interface IBudgetRouterDependencies {
  budgetController: IBudgetController;
  authMiddleware: IAuthMiddleware;
}

export const createBudgetInfoRouter = ({ budgetController, authMiddleware }: IBudgetRouterDependencies) => {
  const budgetInfoRouter = Router();
  budgetInfoRouter.use(authMiddleware.isAuthenticated);

  budgetInfoRouter.post('/create-budget-info', validateRequest(validateBudgetInformation), budgetController.createBudgetInfo);
  budgetInfoRouter.get('/get-budget-info', budgetController.getAllBudgetInfo);
  return budgetInfoRouter;
};
