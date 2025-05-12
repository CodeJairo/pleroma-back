import { Request, Response } from 'express';
import { IContractController, IContractService } from 'types';
import { handleError } from '@utils/handle-error';

export class ContractController implements IContractController {
  #contractService;
  constructor({ contractService }: { contractService: IContractService }) {
    this.#contractService = contractService;
  }

  createJuridicalPerson = async (req: Request, res: Response): Promise<any> => {
    try {
      console.log(req.user?.id);
      await this.#contractService.createJuridicalPerson({ data: req.body, createdBy: req.user!.id });
      return res.status(200).json({ message: 'Juridical person created successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  getAllJuridicalPerson = async (req: Request, res: Response) => {
    try {
      const juridicalPersonArray = await this.#contractService.getAllJuridicalPerson(req.user!.id);
      return res.status(200).send(juridicalPersonArray);
    } catch (error) {
      return handleError(error, res);
    }
  };
}
