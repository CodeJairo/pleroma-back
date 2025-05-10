import { Request, Response } from 'express';
import { IContractController, IContractService } from 'types';
import { CustomError } from 'utils/custom-errors';

export class ContractController implements IContractController {
  #contractService;
  constructor({ contractService }: { contractService: IContractService }) {
    this.#contractService = contractService;
  }

  createJuridicalPerson = async (req: Request, res: Response) => {
    try {
      const juridicalPerson = await this.#contractService.createJuridicalPerson({ data: req.body });
      res.status(200).json({ juridicalPerson });
    } catch (error) {
      this.#handleError(error, res);
    }
  };

  #handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  };
}
