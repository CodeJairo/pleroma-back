import { validateRequest } from '@middlewares/validate-request';
import { validateBudgetInformation } from '@schemas/budget-information.schema';
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
  return budgetInfoRouter;
};
