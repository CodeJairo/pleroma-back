import { CustomError, InternalServerError, redisClient } from '@utils/index';
import { IContractModel, IContractService, IJuridicalPerson } from 'types';

export class ContractService implements IContractService {
  #contractModel;
  constructor({ contractModel }: { contractModel: IContractModel }) {
    this.#contractModel = contractModel;
  }

  async createJuridicalPerson({ data }: { data: IJuridicalPerson }) {
    try {
      const redisKey = `juridicalPerson:${data.businessDocumentNumber}`;
      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData);
      await this.#contractModel.createJuridicalPerson({ data });
      await redisClient.set(redisKey, JSON.stringify(data), {
        expiration: { type: 'EX', value: 60 * 60 * 1 },
      });

      return data;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error creating juridical person');
    }
  }
}
