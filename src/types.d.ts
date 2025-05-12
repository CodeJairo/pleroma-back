import { Request, Response } from 'express';

export interface AppDependencies {
  contractController: IContractController;
  authController: IAuthController;
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
  createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void>;
  getAllJuridicalPerson(): Promise<any[]>;
}

export interface IAuthService {
  register({ data }: { data: IUser }): Promise<any>;
  // login(req: Request, res: Response): Promise<any>;
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
  createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void>;
  getJuridicalPerson({ businessDocumentNumber }: { businessDocumentNumber: string }): Promise<any>;
  getAllJuridicalPerson(): Promise<any[]>;
  // getJuridicalPersonById({ id }: { id: string }): Promise<any>;
  // updateJuridicalPerson({ id, data }: { id: string; data: IJuridicalPerson }): Promise<void>;
  // deleteJuridicalPerson({ id }: { id: string }): Promise<void>;
}

export interface IAuthModel {
  register({ data }: { data: IUser }): Promise<any>;
  getUserByEmail({ email }: { email: string }): Promise<any>;
  getUserById({ id }: { id: string }): Promise<any>;
  getUserByUsername({ username }: { username: string }): Promise<any>;
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
}

export interface IUser {
  username: string;
  password: string;
  email: string;
}

type DocumentType = 'CC' | 'CE' | 'PAS';
type Genre = 'M' | 'F';
type BankAccountType = 'AHORRO' | 'CORRIENTE';
