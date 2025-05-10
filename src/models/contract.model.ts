import { IJuridicalPerson } from 'types';

export class ContractModel {
  static async createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<IJuridicalPerson> {
    console.log(`Creating juridical person: ${data.businessName}`);
    return data;
  }
}
