import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: RequestPayload;
    }
  }
}

interface RequestPayload {
  id: string;
  username: string;
}

export interface AppDependencies {
  contractController: IContractController;
  authController: IAuthController;
  authMiddleware: IAuthMiddleware;
}

export interface IContractController {
  createJuridicalPerson(req: Request, res: Response): Promise<any>;
  getAllJuridicalPerson(req: Request, res: Response);
}

export interface IAuthController {
  register(req: Request, res: Response): Promise<any>;
  login(req: Request, res: Response): Promise<any>;
  logout(req: Request, res: Response): Promise<any>;
  // refreshToken(req: Request, res: Response): Promise<any>;
  // forgotPassword(req: Request, res: Response): Promise<any>;
  // resetPassword(req: Request, res: Response): Promise<any>;
  // verifyEmail(req: Request, res: Response): Promise<any>;
  // getUserProfile(req: Request, res: Response): Promise<any>;
  // updateUserProfile(req: Request, res: Response): Promise<any>;
  // deleteUserProfile(req: Request, res: Response): Promise<any>;
}

export interface IContractService {
  createJuridicalPerson({ data, createdBy }: { data: IJuridicalPerson; createdBy: string }): Promise<void>;
  getAllJuridicalPerson(id): Promise<any[]>;
}

export interface IAuthService {
  register({ data }: { data: IUserRegister }): Promise<void>;
  login({ data }: { data: IUserLogin }): Promise<string>;
  isUserActive({ id }: { id: string }): Promise<boolean>;
  isUserAdmin({ id }: { id: string }): Promise<boolean>;
  // logout(req: Request, res: Response): Promise<any>;
  // refreshToken(req: Request, res: Response): Promise<any>;
  // forgotPassword(req: Request, res: Response): Promise<any>;
  // resetPassword(req: Request, res: Response): Promise<any>;
  // verifyEmail(req: Request, res: Response): Promise<any>;
  // getUserProfile(req: Request, res: Response): Promise<any>;
  // updateUserProfile(req: Request, res: Response): Promise<any>;
  // deleteUserProfile(req: Request, res: Response): Promise<any>;
}

export interface IContractModel {
  createJuridicalPerson({ data, createdBy }: { data: IJuridicalPerson; createdBy: string }): Promise<void>;
  getJuridicalPerson({
    businessDocumentNumber,
    createdBy,
  }: {
    businessDocumentNumber: string;
    createdBy: string;
  }): Promise<any>;
  getAllJuridicalPerson(id): Promise<any[]>;
  // getJuridicalPersonById({ id }: { id: string }): Promise<any>;
  // updateJuridicalPerson({ id, data }: { id: string; data: IJuridicalPerson }): Promise<void>;
  // deleteJuridicalPerson({ id }: { id: string }): Promise<void>;
}

export interface IAuthModel {
  register({ data }: { data: IUserRegister }): Promise<IUserModel>;
  getUserByEmail({ email }: { email: string }): Promise<IUserModel | null>;
  getUserById({ id }: { id: string }): Promise<IUserModel | null>;
  getUserByUsername({ username }: { username: string }): Promise<IUserModel | null>;
}

export interface IJuridicalPerson {
  businessName: string;
  businessDocumentNumber: string;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  expeditionAddress: string;
  birthDate: Date;
  genre: Genre;
  address: string;
  phone: string;
  phone2: string;
  email: string;
  bank: string;
  bankAccountNumber: string;
  accountType: BankAccountType;
  createdBy: string;
}

export interface IUserModel {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

type UserRole = 'USER' | 'ADMIN';

export interface IUserRegister {
  username: string;
  password: string;
  email: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

type DocumentType = 'CC' | 'CE' | 'PAS';
type Genre = 'M' | 'F';
type BankAccountType = 'AHORRO' | 'CORRIENTE';

export interface IAuthMiddleware {
  isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<any>;
  isAdmin(req: Request, res: Response, next: NextFunction): Promise<any>;
  // isUserActive(req: Request, res: Response, next: NextFunction): Promise<any>;
  // isUser(req: Request, res: Response, next: NextFunction): Promise<any>;
}
