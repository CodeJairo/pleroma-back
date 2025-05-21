import { ConflictError, CustomError, generateRedisKey, InternalServerError, redisClient, setRedisCache } from '@utils/index';
import { IContractModel, IContractService, IJuridicalPersonEntity, INaturalPersonEntity } from 'types';

export class ContractService implements IContractService {
  #contractModel;
  constructor({ contractModel }: { contractModel: IContractModel }) {
    this.#contractModel = contractModel;
  }

  // =========================
  // SECCIÓN: PERSONA NATURAL
  // =========================

  /**
   * Crea una persona natural.
   */
  async createNaturalPerson({ data, createdBy }: { data: INaturalPersonEntity; createdBy: string }) {
    try {
      const existNaturalPerson = await this.#contractModel.getNaturalPerson({
        document: data.documentNumber,
        createdBy,
      });
      if (existNaturalPerson) throw new ConflictError('Ya existe una persona natural con ese número de documento.');
      await this.#contractModel.createNaturalPerson({ data, createdBy });
      const redisKey = generateRedisKey('naturalPersonArray', createdBy);
      await redisClient.del(redisKey);
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo crear la persona natural. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene todas las personas naturales creadas por un usuario.
   */
  async getAllNaturalPerson(id: string): Promise<any[]> {
    try {
      const redisKey = generateRedisKey('naturalPersonArray', id);
      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData);
      const naturalPersonArray = await this.#contractModel.getAllNaturalPerson(id);
      await setRedisCache(redisKey, naturalPersonArray, 60 * 60 * 24);
      return naturalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo consultar la lista de personas naturales. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene todas las personas naturales por número de documento y usuario creador.
   */
  async getAllNaturalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }): Promise<any[]> {
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

  /**
   * Crea una persona jurídica.
   */
  async createJuridicalPerson({ data, createdBy }: { data: IJuridicalPersonEntity; createdBy: string }): Promise<void> {
    try {
      const existJuridicalPerson = await this.#contractModel.getJuridicalPerson({
        document: data.businessDocumentNumber,
        createdBy,
      });
      if (existJuridicalPerson) throw new ConflictError('Ya existe una persona jurídica con ese NIT.');
      await this.#contractModel.createJuridicalPerson({ data, createdBy });
      const redisKey = generateRedisKey('juridicalPersonArray', createdBy);
      await redisClient.del(redisKey);
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo crear la persona jurídica. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene todas las personas jurídicas creadas por un usuario.
   */
  async getAllJuridicalPerson(id: string): Promise<any[]> {
    try {
      const redisKey = generateRedisKey('juridicalPersonArray', id);
      const redisData = await redisClient.get(redisKey);
      if (redisData) return JSON.parse(redisData);
      const juridicalPersonArray = await this.#contractModel.getAllJuridicalPerson(id);
      await setRedisCache(redisKey, juridicalPersonArray, 60 * 60 * 24);
      return juridicalPersonArray;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo consultar la lista de personas jurídicas. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene todas las personas jurídicas por número de documento y usuario creador.
   */
  async getAllJuridicalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }): Promise<any[]> {
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

  /**
   * Obtiene todas las personas (jurídicas y naturales) creadas por un usuario.
   */
  async getAllContractors(id: string): Promise<any[]> {
    try {
      const juridicalPersons = await this.getAllJuridicalPerson(id);
      const naturalPersons = await this.getAllNaturalPerson(id);
      return [...juridicalPersons, ...naturalPersons];
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo consultar la lista de contratistas. Intenta nuevamente más tarde.');
    }
  }
}
