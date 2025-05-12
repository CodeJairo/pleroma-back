import { Router } from 'express';
import { IContractController } from 'types';
import { validateRequest } from 'middlewares/validate-request';
import { validateJuridicalPerson } from '@schemas/index';
import { IAuthMiddleware } from '../types';

interface ContractRouterDependencies {
  contractController: IContractController;
  authMiddleware: IAuthMiddleware;
}

export const createContractRouter = ({ contractController, authMiddleware }: ContractRouterDependencies) => {
  const contractRouter = Router();
  contractRouter.use(authMiddleware.isAuthenticated);
  contractRouter.post(
    '/create-juridical-person',
    validateRequest(validateJuridicalPerson),
    contractController.createJuridicalPerson
  );
  contractRouter.get('/get-all-juridical-person', contractController.getAllJuridicalPerson);
  return contractRouter;
};
