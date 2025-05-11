import { CustomError, InternalServerError } from '@utils/index';
import { IContractModel, IContractService, IJuridicalPerson } from 'types';

export class ContractService implements IContractService {
  #contractModel;
  constructor({ contractModel }: { contractModel: IContractModel }) {
    this.#contractModel = contractModel;
  }

  async createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void> {
    try {
      await this.#contractModel.createJuridicalPerson({ data });
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error creating juridical person');
    }
  }
}
