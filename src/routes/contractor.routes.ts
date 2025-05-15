import { Router } from 'express';
import { IContractController, IAuthMiddleware } from 'types';
import { validateRequest } from '@middlewares/index';
import { validateJuridicalPerson } from '@schemas/index';

interface ContractRouterDependencies {
  contractController: IContractController;
  authMiddleware: IAuthMiddleware;
}

export const createContractRouter = ({ contractController, authMiddleware }: ContractRouterDependencies) => {
  const contractRouter = Router();
  contractRouter.use(authMiddleware.isAuthenticated);
  contractRouter.post('/create-juridical-person', validateRequest(validateJuridicalPerson), contractController.createJuridicalPerson);
  contractRouter.get('/get-all-juridical-person', contractController.getAllJuridicalPerson);

  return contractRouter;
};
