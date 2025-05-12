import { IContractModel, IJuridicalPerson } from 'types';
import prisma from './prisma';
import { InternalServerError } from '@utils/custom-errors';

export class ContractModel implements IContractModel {
  async createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void> {
    try {
      await prisma.juridicalPerson.create({
        data: {
          ...data,
          createdBy: 'any', // TODO: replace with actual user ID
          birthDate: new Date(data.birthDate),
        },
      });
      return;
    } catch (error) {
      console.log(error);
      throw new InternalServerError('Error creating juridical person');
    }
  }

  async getJuridicalPerson({ businessDocumentNumber }: { businessDocumentNumber: string }) {
    const juridicalPerson = await prisma.juridicalPerson.findFirst({
      where: {
        businessDocumentNumber,
      },
    });
    if (juridicalPerson) return juridicalPerson;
    return null;
  }

  getAllJuridicalPerson(): Promise<any[]> {
    return prisma.juridicalPerson.findMany();
  }
}
