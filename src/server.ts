import { createApp } from './app';
import {
  AppDependencies,
  IAuthController,
  IAuthMiddleware,
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
import { AuthMiddleware } from '@middlewares/auth';

// Instantiate the models
const contractModel: IContractModel = new ContractModel();
const authModel: IAuthModel = new AuthModel();

// Instantiate the services
const contractService: IContractService = new ContractService({ contractModel });
const authService: IAuthService = new AuthService({ authModel });

// Instantiate the controllers
const contractController: IContractController = new ContractController({ contractService });
const authController: IAuthController = new AuthController({ authService });

// Instantiate the Middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware({ authService });

createApp({ contractController, authController, authMiddleware } as AppDependencies);
