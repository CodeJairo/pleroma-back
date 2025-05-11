import { IContractModel, IJuridicalPerson } from 'types';
import prisma from './prisma';
import { InternalServerError } from '@utils/custom-errors';

export class ContractModel implements IContractModel {
  async createJuridicalPerson({ data }: { data: IJuridicalPerson }): Promise<void> {
    try {
      await prisma.juridicalPerson.create({
        data: {
          ...data,
          birthDate: new Date(data.birthDate),
        },
      });
      return;
    } catch (error) {
      console.log(error);
      throw new InternalServerError('Error creating juridical person');
    }
  }
}
