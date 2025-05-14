import { ConflictError, CustomError, InternalServerError, redisClient } from '@utils/index';
import { IContractModel, IContractService, IJuridicalPersonEntity } from 'types';

export class ContractService implements IContractService {
  #contractModel;
  constructor({ contractModel }: { contractModel: IContractModel }) {
    this.#contractModel = contractModel;
  }
  async getAllJuridicalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }) {
    try {
      const juridicalPersonArray = await this.#contractModel.getAllJuridicalPersonByDocumentNumber({
        document,
        createdBy,
      });
      return juridicalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error getting all juridical persons please try again');
    }
  }

  async createJuridicalPerson({ data, createdBy }: { data: IJuridicalPersonEntity; createdBy: string }): Promise<void> {
    try {
      const existJuridicalPerson = await this.#contractModel.getJuridicalPerson({
        document: data.businessDocumentNumber,
        createdBy,
      });
      if (existJuridicalPerson) throw new ConflictError('Juridical person already exists');
      await this.#contractModel.createJuridicalPerson({ data, createdBy });
      const redisKey = this.#generateRedisKey('juridicalPersonArray', createdBy);
      await redisClient.del(redisKey);
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error creating juridical person');
    }
  }

  async getAllJuridicalPerson(id: string): Promise<any[]> {
    try {
      const redisKey = this.#generateRedisKey('juridicalPersonArray', id);

      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData);
      const juridicalPersonArray = await this.#contractModel.getAllJuridicalPerson(id);
      await this.#setRedisCache(redisKey, juridicalPersonArray, 60 * 60 * 24);
      return juridicalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error getting all juridical persons please try again');
    }
  }

  #generateRedisKey(prefix: string, ...args: string[]): string {
    return `${prefix}:${args.join('-')}`;
  }

  async #setRedisCache(key: string, value: any, expirationInSeconds: number): Promise<void> {
    await redisClient.set(key, JSON.stringify(value), {
      expiration: { type: 'EX', value: expirationInSeconds },
    });
  }
}
