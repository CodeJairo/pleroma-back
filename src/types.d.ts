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
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  expeditionAddress: string;
  birthDate: Date;
  genre: genre;
  address: string;
  phone: string;
  phone2: string;
  email: string;
  bank: string;
  accountType: accountType;
  accountNumber: string;
}

type DocumentType = 'CC' | 'CE' | 'PAS';
type genre = 'M' | 'F';
type accountType = 'AHORRO' | 'CORRIENTE';
