import { CustomError, InternalServerError } from '@utils/index';
import { IBudgetInfoEntity, IBudgetModel, IBudgetService } from 'types';

export class BudgetService implements IBudgetService {
  #budgetModel;
  constructor({ budgetModel }: { budgetModel: IBudgetModel }) {
    this.#budgetModel = budgetModel;
  }

  async createBudgetInfo({ data, createdBy }: { data: IBudgetInfoEntity; createdBy: string }) {
    try {
      await this.#budgetModel.createBudgetInfo({ data, createdBy });
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error creating budget info');
    }
  }
}
