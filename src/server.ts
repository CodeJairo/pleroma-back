import { createApp } from './app';
import {
  AppDependencies,
  IAuthController,
  IAuthModel,
  IAuthService,
  IContractController,
  IContractModel,
  IContractService,
} from 'types';
import { AuthModel } from '@models/auth.model';
import { ContractModel } from '@models/contract.model';
import { ContractController } from '@controllers/index';
import { AuthController } from '@controllers/index';
import { ContractService } from '@services/index';
import { AuthService } from '@services/index';

// Instantiate the models
const contractModel: IContractModel = new ContractModel();
const authModel: IAuthModel = new AuthModel();

// Instantiate the services
const contractService: IContractService = new ContractService({ contractModel });
const authService: IAuthService = new AuthService({ authModel });

// Instantiate the controllers
const contractController: IContractController = new ContractController({ contractService });
const authController: IAuthController = new AuthController({ authService });

createApp({ contractController, authController } as AppDependencies);
