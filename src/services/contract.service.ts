import { ConflictError, CustomError, InternalServerError } from '@utils/index';
import { IContractModel, IContractService, IJuridicalPerson } from 'types';

export class ContractService implements IContractService {
  #contractModel;
  constructor({ contractModel }: { contractModel: IContractModel }) {
    this.#contractModel = contractModel;
  }

  async createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void> {
    try {
      const existJuridicalPerson = await this.#contractModel.getJuridicalPerson({
        businessDocumentNumber: data.businessDocumentNumber,
      });
      if (existJuridicalPerson) throw new ConflictError('Juridical person already exists');
      await this.#contractModel.createJuridicalPerson({ data });
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error creating juridical person');
    }
  }

  getAllJuridicalPerson(): Promise<any[]> {
    try {
      return this.#contractModel.getAllJuridicalPerson();
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error getting all juridical persons');
    }
  }
}
