import { ConflictError, CustomError, InternalServerError, redisClient } from '@utils/index';
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
      const redisKey = 'juridicalPersonArray';
      await redisClient.del(redisKey);
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error creating juridical person');
    }
  }

  async getAllJuridicalPerson(): Promise<any[]> {
    try {
      const redisKey = 'juridicalPersonArray';
      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData);
      const juridicalPersonArray = await this.#contractModel.getAllJuridicalPerson();
      await redisClient.set(redisKey, JSON.stringify(juridicalPersonArray), {
        expiration: { type: 'EX', value: 60 * 60 * 24 },
      });
      return juridicalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error getting all juridical persons please try again');
    }
  }
}
