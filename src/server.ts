import { createApp } from './app';
import {
  AppDependencies,
  IAuthController,
  IAuthMiddleware,
  IAuthModel,
  IAuthService,
  IBudgetController,
  IBudgetModel,
  IBudgetService,
  IContractController,
  IContractModel,
  IContractService,
} from 'types';
import { AuthModel, BudgetModel, ContractModel } from '@models/index';
import { ContractService, AuthService, BudgetService } from '@services/index';
import { ContractController, AuthController, BudgetController } from '@controllers/index';
import { AuthMiddleware } from '@middlewares/auth';

// Instantiate the models
const contractModel: IContractModel = new ContractModel();
const authModel: IAuthModel = new AuthModel();
const budgetModel: IBudgetModel = new BudgetModel();

// Instantiate the services
const contractService: IContractService = new ContractService({ contractModel });
const authService: IAuthService = new AuthService({ authModel });
const budgetService: IBudgetService = new BudgetService({ budgetModel });

// Instantiate the controllers
const contractController: IContractController = new ContractController({ contractService });
const authController: IAuthController = new AuthController({ authService });
const budgetController: IBudgetController = new BudgetController({ budgetService });

// Instantiate the Middlewares
const authMiddleware: IAuthMiddleware = new AuthMiddleware({ authService });

createApp({ contractController, authController, authMiddleware, budgetController } as AppDependencies);
