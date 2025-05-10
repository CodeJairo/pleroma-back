export interface AppDependencies {
  contractController: IContractController;
}

export interface IContractService {
  createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<IJuridicalPerson>;
}

export interface IContractController {
  createJuridicalPerson(req: any, res: any): Promise<void>;
}
export interface IContractModel {
  createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<IJuridicalPerson>;
}

export interface IJuridicalPerson {
  businessName: string;
  businessDocumentType: 'NIT';
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
  BankAccountNumber: BankAccountNumber;
  accountNumber: string;
}

type DocumentType = 'CC' | 'CE' | 'PAS';
type Genre = 'M' | 'F';
type BankAccountNumber = 'AHORRO' | 'CORRIENTE';
