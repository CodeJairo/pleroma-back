import { IBudgetInfoEntity, IBudgetModel, IRubro } from 'types';
import prisma from './prisma';
import { InternalServerError } from '@utils/custom-errors';

export class BudgetModel implements IBudgetModel {
  async createBudgetInfo({ data, createdBy }: { data: IBudgetInfoEntity; createdBy: string }): Promise<void> {
    try {
      await prisma.budgetInformation.create({
        data: {
          ...data,
          issuanceDate: new Date(data.issuanceDate),
          rubros: {
            create: data.rubros.map((rubro: IRubro) => ({
              name: rubro.name,
              code: rubro.code,
              assignedAmount: rubro.assignedAmount,
            })),
          },
          createdBy,
        },
      });
    } catch (error) {
      throw new InternalServerError('Error creating budget info');
    }
  }

  async getBudgetInfo({ certificateNumber, createdBy }: { certificateNumber: string; createdBy: string }) {
    try {
      const budgetInfo = await prisma.budgetInformation.findFirst({
        where: {
          certificateNumber,
          createdBy,
        },
        include: {
          rubros: true,
        },
      });

      if (budgetInfo) return budgetInfo;
      return null;
    } catch (error) {
      throw new InternalServerError('Error getting budget info');
    }
  }
}
