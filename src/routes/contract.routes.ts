import { Router } from 'express';
import { IContractController } from 'types';

interface ContractRouterDependencies {
  contractController: IContractController;
}

export const createContractRouter = ({ contractController }: ContractRouterDependencies) => {
  const contractRouter = Router();

  contractRouter.post('/create-juridical-person', contractController.createJuridicalPerson);

  return contractRouter;
};
