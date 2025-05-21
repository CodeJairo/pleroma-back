import { InternalServerError } from '@utils/index';
import { IContractModel, IJuridicalPersonEntity, INaturalPersonEntity } from 'types';
import prisma from './prisma';

export class ContractModel implements IContractModel {
  // =========================
  // SECCIÓN: PERSONA NATURAL
  // =========================

  /**
   * Obtiene todas las personas naturales por número de documento y usuario creador.
   */
  async getAllNaturalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }) {
    try {
      return await prisma.naturalPerson.findMany({
        where: {
          documentNumber: {
            startsWith: document,
            mode: 'insensitive',
          },
          createdBy,
        },
      });
    } catch (error) {
      throw new InternalServerError('No se pudo consultar la lista de personas naturales. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Crea una persona natural.
   */
  async createNaturalPerson({ data, createdBy }: { data: INaturalPersonEntity; createdBy: string }): Promise<void> {
    try {
      await prisma.naturalPerson.create({
        data: {
          ...data,
          createdBy,
          birthDate: new Date(data.birthDate),
        },
      });
      return;
    } catch (error) {
      console.log(error);
      throw new InternalServerError('No se pudo crear la persona natural. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene una persona natural por número de documento y usuario creador.
   */
  async getNaturalPerson({ document, createdBy }: { document: string; createdBy: string }): Promise<any> {
    try {
      const naturalPerson = await prisma.naturalPerson.findFirst({
        where: {
          documentNumber: document,
          createdBy,
        },
      });
      if (naturalPerson) return naturalPerson;
      return null;
    } catch (error) {
      console.log(error);
      throw new InternalServerError('No se pudo consultar la persona natural. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene todas las personas naturales creadas por un usuario.
   */
  async getAllNaturalPerson(id: string) {
    try {
      return prisma.naturalPerson.findMany({
        where: {
          createdBy: id,
        },
      });
    } catch (error) {
      throw new InternalServerError('No se pudo consultar la lista de personas naturales. Intenta nuevamente más tarde.');
    }
  }

  // ============================
  // SECCIÓN: PERSONA JURÍDICA
  // ============================

  /**
   * Obtiene todas las personas jurídicas por número de documento y usuario creador.
   */
  async getAllJuridicalPersonByDocumentNumber({ document, createdBy }: { document: string; createdBy: string }) {
    try {
      return await prisma.juridicalPerson.findMany({
        where: {
          businessDocumentNumber: {
            startsWith: document,
            mode: 'insensitive',
          },
          createdBy,
        },
      });
    } catch (error) {
      throw new InternalServerError('No se pudo consultar la lista de personas jurídicas. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Crea una persona jurídica.
   */
  async createJuridicalPerson({ data, createdBy }: { data: IJuridicalPersonEntity; createdBy: string }) {
    try {
      await prisma.juridicalPerson.create({
        data: {
          ...data,
          createdBy,
          birthDate: new Date(data.birthDate),
        },
      });
      return;
    } catch (error) {
      console.log(error);
      throw new InternalServerError('No se pudo crear la persona jurídica. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene una persona jurídica por número de documento y usuario creador.
   */
  async getJuridicalPerson({ document, createdBy }: { document: string; createdBy: string }) {
    try {
      const juridicalPerson = await prisma.juridicalPerson.findFirst({
        where: {
          businessDocumentNumber: document,
          createdBy,
        },
      });
      if (juridicalPerson) return juridicalPerson;
      return null;
    } catch (error) {
      console.log(error);
      throw new InternalServerError('No se pudo consultar la persona jurídica. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene todas las personas jurídicas creadas por un usuario.
   */
  getAllJuridicalPerson(id: string) {
    try {
      return prisma.juridicalPerson.findMany({
        where: {
          createdBy: id,
        },
      });
    } catch (error) {
      throw new InternalServerError('No se pudo consultar la lista de personas jurídicas. Intenta nuevamente más tarde.');
    }
  }
}
