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
      await this.#contractService.createJuridicalPerson({ data: req.body, createdBy: req.user!.id });
      return res.status(200).json({ message: 'Juridical person created successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  getAllJuridicalPerson = async (req: Request, res: Response): Promise<any> => {
    try {
      const { document } = req.query;

      let juridicalPersonArray;

      if (document && typeof document === 'string') {
        juridicalPersonArray = await this.#contractService.getAllJuridicalPersonByDocumentNumber({
          document: document,
          createdBy: req.user!.id,
        });

        return res.status(200).send(juridicalPersonArray);
      }

      juridicalPersonArray = await this.#contractService.getAllJuridicalPerson(req.user!.id);
      return res.status(200).send(juridicalPersonArray);
    } catch (error) {
      return handleError(error, res);
    }
  };

  // updateJuridicalPerson(req: Request, res: Response): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // deleteJuridicalPerson(req: Request, res: Response): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // getAllNaturalPerson(req: Request, res: Response): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // getNaturalPerson(req: Request, res: Response): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // createNaturalPerson(req: Request, res: Response): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // updateNaturalPerson(req: Request, res: Response): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
  // deleteNaturalPerson(req: Request, res: Response): Promise<any> {
  //   throw new Error('Method not implemented.');
  // }
}
