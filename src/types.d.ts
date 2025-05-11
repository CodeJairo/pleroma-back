export interface AppDependencies {
  contractController: IContractController;
}

export interface IContractController {
  createJuridicalPerson(req: any, res: any): Promise<any>;
}

export interface IContractService {
  createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void>;
}

export interface IContractModel {
  createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void>;
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

type DocumentType = 'CC' | 'CE' | 'PAS';
type Genre = 'M' | 'F';
type BankAccountType = 'AHORRO' | 'CORRIENTE';
