import { Request, Response } from 'express';
import { IContractController, IContractService } from 'types';
import { CustomError } from 'utils/custom-errors';

export class ContractController implements IContractController {
  #contractService;
  constructor({ contractService }: { contractService: IContractService }) {
    this.#contractService = contractService;
  }

  createJuridicalPerson = async (req: Request, res: Response): Promise<any> => {
    try {
      await this.#contractService.createJuridicalPerson({ data: req.body });
      return res.status(200).json({ message: 'Juridical person created successfully' });
    } catch (error) {
      return this.#handleError(error, res);
    }
  };

  getAllJuridicalPerson = async (_req: Request, res: Response) => {
    try {
      const juridicalPersonArray = await this.#contractService.getAllJuridicalPerson();
      return res.status(200).send(juridicalPersonArray);
    } catch (error) {
      return this.#handleError(error, res);
    }
  };

  #handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  };
}
