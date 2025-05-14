import { handleError } from '@utils/index';
import { Request, Response } from 'express';
import { IBudgetController, IBudgetService } from 'types';

export class BudgetController implements IBudgetController {
  #budgetInfoService;
  constructor({ budgetService }: { budgetService: IBudgetService }) {
    this.#budgetInfoService = budgetService;
  }

  createBudgetInfo = async (req: Request, res: Response) => {
    try {
      await this.#budgetInfoService.createBudgetInfo({ data: req.body, createdBy: req.user!.id });
      return res.status(200).json({ message: 'Budget info created successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  getAllBudgetInfo = async (req: Request, res: Response) => {
    try {
      const { certificateNumber } = req.query as { certificateNumber: string };
      const budgetInfo = await this.#budgetInfoService.getBudgetInfo({ certificateNumber, createdBy: req.user!.id });
      return res.status(200).send(budgetInfo);
    } catch (error) {
      return handleError(error, res);
    }
  };
}
