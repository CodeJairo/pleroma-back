import { IContractModel, IJuridicalPerson } from 'types';

export class ContractModel implements IContractModel {
  async createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<IJuridicalPerson> {
    console.log(`Creating juridical person: ${data.name}`);
    return data;
  }
}
