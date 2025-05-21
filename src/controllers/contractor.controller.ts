import { Request, Response } from 'express';
import { IContractController, IContractService } from 'types';
import { handleError } from '@utils/index';

export class ContractController implements IContractController {
  #contractService;
  constructor({ contractService }: { contractService: IContractService }) {
    this.#contractService = contractService;
  }

  // =========================
  // SECCIÓN: PERSONA NATURAL
  // =========================

  /**
   * Crea una persona natural.
   */
  createNaturalPerson = async (req: Request, res: Response) => {
    try {
      await this.#contractService.createNaturalPerson({ data: req.body, createdBy: req.user!.id });
      return res.status(200).json({ message: 'Persona natural creada exitosamente.' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * Obtiene todas las personas naturales creadas por un usuario o por número de documento.
   */
  getAllNaturalPerson = async (req: Request, res: Response) => {
    try {
      const { document } = req.query;
      let naturalPersonArray;

      if (document && typeof document === 'string') {
        naturalPersonArray = await this.#contractService.getAllNaturalPersonByDocumentNumber({
          document,
          createdBy: req.user!.id,
        });
        return res.status(200).send(naturalPersonArray);
      }

      naturalPersonArray = await this.#contractService.getAllNaturalPerson(req.user!.id);
      return res.status(200).send(naturalPersonArray);
    } catch (error) {
      return handleError(error, res);
    }
  };

  // ============================
  // SECCIÓN: PERSONA JURÍDICA
  // ============================

  /**
   * Crea una persona jurídica.
   */
  createJuridicalPerson = async (req: Request, res: Response) => {
    try {
      await this.#contractService.createJuridicalPerson({ data: req.body, createdBy: req.user!.id });
      return res.status(200).json({ message: 'Persona jurídica creada exitosamente.' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  /**
   * Obtiene todas las personas jurídicas creadas por un usuario o por número de documento.
   */
  getAllJuridicalPerson = async (req: Request, res: Response) => {
    try {
      const { document } = req.query;
      let juridicalPersonArray;

      if (document && typeof document === 'string') {
        juridicalPersonArray = await this.#contractService.getAllJuridicalPersonByDocumentNumber({
          document,
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

  // =========================
  // SECCIÓN: GENERAL
  // =========================

  /**
   * Obtiene todas las personas (jurídicas y naturales) creadas por un usuario.
   */
  getAllContractors = async (req: Request, res: Response) => {
    try {
      const contractorsArray = await this.#contractService.getAllContractors(req.user!.id);
      return res.status(200).send(contractorsArray);
    } catch (error) {
      return handleError(error, res);
    }
  };
}
