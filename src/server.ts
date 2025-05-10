import { createApp } from './app';
import { AppDependencies, IContractController, IContractService } from 'types';
import { ContractController } from '@controllers/index';
import { ContractService } from '@services/index';
import { ContractModel } from '@models/contract.model';

const contractService: IContractService = new ContractService({ contractModel: ContractModel });
const contractController: IContractController = new ContractController({ contractService } as {
  contractService: IContractService;
});

createApp({ contractController, contractService } as AppDependencies);
