import { Router } from 'express';
import { validateRequest } from 'middlewares/validate-request';
import { validateJuridicalPerson } from '@schemas/index';
import { IContractController } from 'types';

interface ContractRouterDependencies {
  contractController: IContractController;
}

export const createContractRouter = ({ contractController }: ContractRouterDependencies) => {
  const contractRouter = Router();

  contractRouter.post(
    '/create-juridical-person',
    validateRequest(validateJuridicalPerson),
    contractController.createJuridicalPerson
  );

  return contractRouter;
};
