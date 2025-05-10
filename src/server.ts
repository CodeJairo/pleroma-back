import { createApp } from './app';
import { AppDependencies, IContractController, IContractModel, IContractService } from 'types';
import { ContractController } from '@controllers/index';
import { ContractService } from '@services/index';
import { ContractModel } from '@models/contract.model';

const contractModel: IContractModel = new ContractModel();
const contractService: IContractService = new ContractService({ contractModel });
const contractController: IContractController = new ContractController({ contractService });

createApp({ contractController } as AppDependencies);
