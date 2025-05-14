import { IContractModel, IJuridicalPersonEntity } from 'types';
import prisma from './prisma';
import { InternalServerError } from '@utils/custom-errors';

export class ContractModel implements IContractModel {
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
      throw new InternalServerError('Error getting all juridical persons');
    }
  }

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
      throw new InternalServerError('Error creating juridical person');
    }
  }

  async getJuridicalPerson({ document, createdBy }: { document: string; createdBy: string }) {
    const juridicalPerson = await prisma.juridicalPerson.findFirst({
      where: {
        businessDocumentNumber: document,
        createdBy,
      },
    });

    if (juridicalPerson) return juridicalPerson;
    return null;
  }

  getAllJuridicalPerson(id: string) {
    try {
      return prisma.juridicalPerson.findMany({
        where: {
          createdBy: id,
        },
      });
    } catch (error) {
      throw new InternalServerError('Error getting all juridical persons');
    }
  }
}
