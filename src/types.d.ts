// ---------------------------------------------
// Extensiones de Tipos Globales
// ---------------------------------------------

import { Request, Response } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: RequestPayload;
      token?: string;
    }
  }
}

interface RequestPayload {
  id: string;
  username: string;
}

// ---------------------------------------------
// Tipos Generales y Utilitarios
// ---------------------------------------------
type UserRole = 'USER' | 'ADMIN';
type DocumentType = 'CC' | 'CE' | 'PAS';
type Genre = 'M' | 'F';
type BankAccountType = 'AHORRO' | 'CORRIENTE';

// ---------------------------------------------
// Interfaces de Schemas
// ---------------------------------------------

export interface IJuridicalPersonEntity {
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

export interface INaturalPersonEntity {
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

export interface IBudgetInfoEntity {
  certificateNumber: string;
  issuanceDate: Date;
  totalAssignedAmount: number;
  rubros: IRubro[];
}

export interface IRubro {
  name: string;
  code: string;
  assignedAmount: number;
}

export interface IUserEntity {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  username: string;
  password: string;
  role: UserRole;
  isActive: boolean;
}

export interface IUserRegister {
  username: string;
  password: string;
  email: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

// ---------------------------------------------
// Interfaces de Controladores
// ---------------------------------------------

export interface IContractController {
  // Juridical Person
  getAllJuridicalPerson(req: Request, res: Response): Promise<any>;
  createJuridicalPerson(req: Request, res: Response): Promise<any>;

  // updateJuridicalPerson(req: Request, res: Response): Promise<any>;
  // deleteJuridicalPerson(req: Request, res: Response): Promise<any>;

  // Natural Person
  // getAllNaturalPerson(req: Request, res: Response): Promise<any>;
  // getNaturalPerson(req: Request, res: Response): Promise<any>;
  // createNaturalPerson(req: Request, res: Response): Promise<any>;
  // updateNaturalPerson(req: Request, res: Response): Promise<any>;
  // deleteNaturalPerson(req: Request, res: Response): Promise<any>;
}

export interface IAuthController {
  register(req: Request, res: Response): Promise<any>;
  login(req: Request, res: Response): Promise<any>;
  logout(req: Request, res: Response): Promise<any>;
  refreshToken(req: Request, res: Response): any;
  updateUser(req: Request, res: Response): Promise<any>;
  updateUserAsAdmin(req: Request, res: Response): Promise<any>;
  deleteUser(req: Request, res: Response): Promise<any>;
  activateUser(req: Request, res: Response): Promise<any>;

  // forgotPassword(req: Request, res: Response): Promise<any>;
  // resetPassword(req: Request, res: Response): Promise<any>;
  // verifyEmail(req: Request, res: Response): Promise<any>;
  // getUserProfile(req: Request, res: Response): Promise<any>;
}

export interface IBudgetController {
  createBudgetInfo(req: Request, res: Response): Promise<any>;
  getAllBudgetInfo(req: Request, res: Response): Promise<any>;
}

// ---------------------------------------------
// Interfaces de Modelos
// ---------------------------------------------

export interface IContractModel {
  createJuridicalPerson({ data, createdBy }: { data: IJuridicalPersonEntity; createdBy: string }): Promise<void>;
  getAllJuridicalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }): Promise<any>;
  getAllJuridicalPerson(id): Promise<any[]>;
  getJuridicalPerson({ document, createdBy }: { document: string; createdBy: string }): Promise<any>;
  // getJuridicalPersonById({ id }: { id: string }): Promise<any>;
  // updateJuridicalPerson({ id, data }: { id: string; data: IJuridicalPerson }): Promise<void>;
  // deleteJuridicalPerson({ id }: { id: string }): Promise<void>;
}

export interface IAuthModel {
  register({ data }: { data: IUserRegister }): Promise<IUserEntity>;
  getUserByEmail({ email }: { email: string }): Promise<IUserEntity | null>;
  getUserById({ id }: { id: string }): Promise<IUserEntity | null>;
  getUserByUsername({ username }: { username: string }): Promise<IUserEntity | null>;
  updateUser({ id, data }: { id: string; data: Partial<IUserRegister> }): Promise<void>;
  updateUserAsAdmin({ id, data }: { id: string; data: Partial<IUserEntity> }): Promise<void>;
}

export interface IBudgetModel {
  createBudgetInfo({ data, createdBy }: { data: IBudgetInfoEntity; createdBy: string }): Promise<void>;
  getBudgetInfo({ certificateNumber, createdBy }: { certificateNumber: string; createdBy: string }): Promise<any>;
  getAllBudgetInfo({ createdBy }: { createdBy: string }): Promise<any>;
  getAllBudgetInfoByCertificateNumber({
    certificateNumber,
    createdBy,
  }: {
    certificateNumber: string;
    createdBy: string;
  }): Promise<any>;
}

// ---------------------------------------------
// Interfaces de Servicios
// ---------------------------------------------

export interface IContractService {
  createJuridicalPerson({ data, createdBy }: { data: IJuridicalPersonEntity; createdBy: string }): Promise<void>;

  getAllJuridicalPerson(id): Promise<any[]>;

  getAllJuridicalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }): Promise<any>;
}

export interface IAuthService {
  register({ data }: { data: IUserRegister }): Promise<void>;
  login({ data }: { data: IUserLogin }): Promise<{ serverToken: string; clientToken: string }>;
  isUserActive({ id }: { id: string }): Promise<boolean>;
  isUserAdmin({ id }: { id: string }): Promise<boolean>;
  refreshClientToken({ id: string, username: string }): string;
  refreshServerToken(payload: { id: string; username: string }, token: string): Promise<string>;
  logout(token: string): Promise<void>;
  updateUser({
    id,
    username,
    token,
    data,
  }: {
    id: string;
    username: string;
    token: string;
    data: Partial<IUserRegister>;
  }): Promise<{ serverToken: string; clientToken: string }>;
  updateUserAsAdmin({ id, data }: { id: string; data: Partial<IUserEntity> }): Promise<void>;
  deleteUser({ id, adminId }: { id: string; adminId: string }): Promise<void>;
  activateUser({ id }: { id: string }): Promise<void>;
  // refreshToken({ token }: { token: string }): Promise<{ accessToken: string; refreshToken: string }>;
  // refreshToken(req: Request, res: Response): Promise<any>;
  // forgotPassword(req: Request, res: Response): Promise<any>;
  // resetPassword(req: Request, res: Response): Promise<any>;
  // verifyEmail(req: Request, res: Response): Promise<any>;
  // getUserProfile(req: Request, res: Response): Promise<any>;
  // updateUserProfile(req: Request, res: Response): Promise<any>;
  // deleteUserProfile(req: Request, res: Response): Promise<any>;
}

export interface IBudgetService {
  createBudgetInfo({ data, createdBy }: { data: IBudgetInfoEntity; createdBy: string }): Promise<void>;
  getBudgetInfo({ certificateNumber, createdBy }: { certificateNumber?: string; createdBy: string }): Promise<IBudgetInfoEntity[]>;
}

// ---------------------------------------------
// Interfaces de Dependencias de la Aplicación
// ---------------------------------------------

export interface AppDependencies {
  contractController: IContractController;
  authController: IAuthController;
  authMiddleware: IAuthMiddleware;
  budgetController: IBudgetController;
}

// ---------------------------------------------
// Interfaces de Middlewares
// ---------------------------------------------

export interface IAuthMiddleware {
  isAuthenticated(req: Request, res: Response, next: NextFunction): Promise<any>;
  isAdmin(req: Request, res: Response, next: NextFunction): Promise<any>;
  // isUserActive(req: Request, res: Response, next: NextFunction): Promise<any>;
  // isUser(req: Request, res: Response, next: NextFunction): Promise<any>;
}
