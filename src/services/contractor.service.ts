import { ConflictError, CustomError, generateRedisKey, InternalServerError, redisClient, setRedisCache } from '@utils/index';
import {
  IContractModel,
  IContractorEntity,
  IContractService,
  IJuridicalPersonEntity,
  IJuridicalPersonResponse,
  INaturalPersonEntity,
  INaturalPersonResponse,
} from 'types';

export class ContractService implements IContractService {
  #contractModel;
  constructor({ contractModel }: { contractModel: IContractModel }) {
    this.#contractModel = contractModel;
  }

  // =========================
  // SECCIÓN: PERSONA NATURAL
  // =========================

  async createNaturalPerson({ data, createdBy }: { data: INaturalPersonEntity; createdBy: string }) {
    try {
      let bank = data.bank;
      if (data.bank === 'null' && data.anotherBank) bank = data.anotherBank;
      const { anotherBank, ...dataWithoutAnotherBank } = { ...data, bank };

      const existNaturalPerson = await this.#contractModel.getNaturalPerson({
        document: data.documentNumber,
        createdBy,
      });
      if (existNaturalPerson) throw new ConflictError('Ya existe una persona natural con ese número de documento.');
      await this.#contractModel.createNaturalPerson({ data: dataWithoutAnotherBank, createdBy });
      const redisKey = generateRedisKey('naturalPersonArray', createdBy);
      const contractorsKey = generateRedisKey('contractorsArray', createdBy);
      await redisClient.del(redisKey);
      await redisClient.del(contractorsKey); // Invalida el cache de contratistas
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo crear la persona natural. Intenta nuevamente más tarde.');
    }
  }

  async getAllNaturalPerson(id: string) {
    try {
      const redisKey = generateRedisKey('naturalPersonArray', id);
      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData) as INaturalPersonResponse[];
      const naturalPersonArray = await this.#contractModel.getAllNaturalPerson(id);
      await setRedisCache(redisKey, naturalPersonArray, 60 * 60 * 24);
      return naturalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo consultar la lista de personas naturales. Intenta nuevamente más tarde.');
    }
  }

  async getAllNaturalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }) {
    try {
      const naturalPersonArray = await this.#contractModel.getAllNaturalPersonByDocumentNumber({
        document,
        createdBy,
      });
      return naturalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo consultar la lista de personas naturales. Intenta nuevamente más tarde.');
    }
  }

  // ============================
  // SECCIÓN: PERSONA JURÍDICA
  // ============================

  async createJuridicalPerson({ data, createdBy }: { data: IJuridicalPersonEntity; createdBy: string }): Promise<void> {
    try {
      let bank = data.bank;
      if (data.bank === 'null' && data.anotherBank) bank = data.anotherBank;
      const { anotherBank, ...dataWithoutAnotherBank } = { ...data, bank };

      const existJuridicalPerson = await this.#contractModel.getJuridicalPerson({
        document: data.businessDocumentNumber,
        createdBy,
      });
      if (existJuridicalPerson) throw new ConflictError('Ya existe una persona jurídica con ese NIT.');
      await this.#contractModel.createJuridicalPerson({ data: dataWithoutAnotherBank, createdBy });
      const redisKey = generateRedisKey('juridicalPersonArray', createdBy);
      const contractorsKey = generateRedisKey('contractorsArray', createdBy);
      await redisClient.del(redisKey);
      await redisClient.del(contractorsKey); // Invalida el cache de contratistas
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo crear la persona jurídica. Intenta nuevamente más tarde.');
    }
  }

  async getAllJuridicalPerson(id: string) {
    try {
      const redisKey = generateRedisKey('juridicalPersonArray', id);
      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData) as IJuridicalPersonResponse[];
      const juridicalPersonArray = await this.#contractModel.getAllJuridicalPerson(id);
      await setRedisCache(redisKey, juridicalPersonArray, 60 * 60 * 24);
      return juridicalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo consultar la lista de personas jurídicas. Intenta nuevamente más tarde.');
    }
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
      throw new InternalServerError('No se pudo consultar la lista de personas jurídicas. Intenta nuevamente más tarde.');
    }
  }

  // =========================
  // SECCIÓN: GENERAL
  // =========================

  async getAllContractors(id: string) {
    try {
      const contractorsKey = generateRedisKey('contractorsArray', id);
      const redisData = await redisClient.get(contractorsKey);
      if (redisData) return JSON.parse(redisData) as IContractorEntity[];

      const juridicalPersons = await this.getAllJuridicalPerson(id);
      const naturalPersons = await this.getAllNaturalPerson(id);

      const contractors: IContractorEntity[] = [
        ...juridicalPersons.map((j: IJuridicalPersonResponse) => ({
          id: j.id,
          contractor: j.name,
          contractorDocument: j.documentNumber,
          expeditionAddress: j.expeditionAddress,
          birthDate: j.birthDate,
          genre: j.genre,
        })),
        ...naturalPersons.map((n: INaturalPersonResponse) => ({
          id: n.id,
          contractor: n.name,
          contractorDocument: n.documentNumber,
          expeditionAddress: n.expeditionAddress,
          birthDate: n.birthDate,
          genre: n.genre,
        })),
      ];

      await setRedisCache(contractorsKey, contractors, 60 * 60 * 24);
      return contractors;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo consultar la lista de contratistas. Intenta nuevamente más tarde.');
    }
  }
}
