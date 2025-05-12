import { IContractModel, IJuridicalPerson } from 'types';
import prisma from './prisma';
import { InternalServerError } from '@utils/custom-errors';

export class ContractModel implements IContractModel {
  async createJuridicalPerson({ data, createdBy }: { data: IJuridicalPerson; createdBy: string }): Promise<void> {
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
      throw new InternalServerError('Error creating juridical person');
    }
  }

  async getJuridicalPerson({
    businessDocumentNumber,
    createdBy,
  }: {
    businessDocumentNumber: string;
    createdBy: string;
  }) {
    const juridicalPerson = await prisma.juridicalPerson.findFirst({
      where: {
        businessDocumentNumber,
        createdBy,
      },
    });
    if (juridicalPerson) return juridicalPerson;
    return null;
  }

  getAllJuridicalPerson(id: string): Promise<any[]> {
    return prisma.juridicalPerson.findMany({
      where: {
        createdBy: id,
      },
    });
  }
}
