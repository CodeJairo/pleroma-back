import { Router } from 'express';
import { IContractController } from 'types';
import { validateRequest } from 'middlewares/validate-request';
import { validateJuridicalPerson } from '@schemas/index';

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
  contractRouter.get('/get-all-juridical-person', contractController.getAllJuridicalPerson);
  return contractRouter;
};
