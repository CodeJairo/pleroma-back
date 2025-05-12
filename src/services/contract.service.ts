import { ConflictError, CustomError, InternalServerError, redisClient } from '@utils/index';
import { IContractModel, IContractService, IJuridicalPerson } from 'types';

export class ContractService implements IContractService {
  #contractModel;
  constructor({ contractModel }: { contractModel: IContractModel }) {
    this.#contractModel = contractModel;
  }

  async createJuridicalPerson({ data, createdBy }: { data: IJuridicalPerson; createdBy: string }): Promise<void> {
    try {
      const existJuridicalPerson = await this.#contractModel.getJuridicalPerson({
        businessDocumentNumber: data.businessDocumentNumber,
        createdBy,
      });
      if (existJuridicalPerson) throw new ConflictError('Juridical person already exists');
      await this.#contractModel.createJuridicalPerson({ data, createdBy });
      const redisKey = `juridicalPersonArray:${createdBy}`;
      await redisClient.del(redisKey);
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error creating juridical person');
    }
  }

  async getAllJuridicalPerson(id: string): Promise<any[]> {
    try {
      const redisKey = `juridicalPersonArray:${id}`;
      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData);
      const juridicalPersonArray = await this.#contractModel.getAllJuridicalPerson(id);
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
