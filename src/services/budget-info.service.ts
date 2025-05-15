import { ConflictError, CustomError, InternalServerError } from '@utils/index';
import { IBudgetInfoEntity, IBudgetModel, IBudgetService } from 'types';

export class BudgetService implements IBudgetService {
  #budgetModel;
  constructor({ budgetModel }: { budgetModel: IBudgetModel }) {
    this.#budgetModel = budgetModel;
  }

  /**
   * Crea un nuevo presupuesto, validando que el número de certificado no exista
   * y que las fechas sean coherentes con los certificados anteriores y siguientes.
   */
  async createBudgetInfo({ data, createdBy }: { data: IBudgetInfoEntity; createdBy: string }) {
    try {
      // Validar que el número de certificado sea válido (es un número)
      if (!data.certificateNumber || isNaN(Number(data.certificateNumber))) {
        throw new ConflictError('Invalid certificate number');
      }

      // Validar que la fecha de emisión sea válida
      if (!data.issuanceDate || isNaN(new Date(data.issuanceDate).getTime())) {
        throw new ConflictError('Invalid issuance date');
      }

      const certificateNumber = Number(data.certificateNumber);
      const issuanceDate = new Date(data.issuanceDate);

      // Verificar si ya existe un presupuesto con el mismo número de certificado
      const existingBudgetInfo = await this.#budgetModel.getBudgetInfo({ certificateNumber: data.certificateNumber, createdBy });
      if (existingBudgetInfo) throw new ConflictError(`Certificate number ${data.certificateNumber} already exists`);

      // Obtener todos los presupuestos existentes y ordenarlos por número de certificado
      const allBudgetInfo = await this.#budgetModel.getAllBudgetInfo({ createdBy });
      const sortedBudgetInfo = this.#sortBudgetsByCertificateNumber(allBudgetInfo);

      // Buscar el presupuesto anterior y siguiente para validar las fechas de emisión
      const previousBudget = sortedBudgetInfo.find(budget => Number(budget.certificateNumber) === certificateNumber - 1);
      const nextBudget = sortedBudgetInfo.find(budget => Number(budget.certificateNumber) === certificateNumber + 1);

      // Validación de la fecha de emisión con respecto a los presupuestos adyacentes
      this.#validateIssuanceDate(certificateNumber, issuanceDate, previousBudget, nextBudget);

      // Si pasa todas las validaciones, creamos el presupuesto
      await this.#budgetModel.createBudgetInfo({ data, createdBy });
      return;
    } catch (error) {
      // Si se lanza una CustomError, la volvemos a tirar
      if (error instanceof CustomError) throw error;
      // Si hay un error inesperado, lanzamos un error genérico
      throw new InternalServerError('Error creating budget info');
    }
  }

  /**
   * Obtiene un presupuesto por número de certificado o todos los presupuestos de un usuario
   * y los ordena por número de certificado de manera ascendente.
   */
  async getBudgetInfo({ certificateNumber, createdBy }: { certificateNumber?: string; createdBy: string }) {
    try {
      // Si se pasa un número de certificado, obtenemos ese presupuesto, de lo contrario, obtenemos todos los presupuestos
      const budgetInfo = certificateNumber
        ? await this.#budgetModel.getAllBudgetInfoByCertificateNumber({ certificateNumber, createdBy })
        : await this.#budgetModel.getAllBudgetInfo({ createdBy });

      // Ordenar los presupuestos por número de certificado de manera ascendente
      return this.#sortBudgetsByCertificateNumber(budgetInfo);
    } catch (error) {
      // Si se lanza una CustomError, la volvemos a tirar
      if (error instanceof CustomError) throw error;
      // Si hay un error inesperado, lanzamos un error genérico
      throw new InternalServerError('Error getting budget info');
    }
  }

  /**
   * Ordena un arreglo de presupuestos por número de certificado.
   *
   * @param budgets Arreglo de presupuestos a ordenar.
   * @returns Arreglo de presupuestos ordenado por número de certificado.
   */
  #sortBudgetsByCertificateNumber(budgets: any[]): any[] {
    return budgets.sort((a: any, b: any) => Number(a.certificateNumber) - Number(b.certificateNumber));
  }

  /**
   * Valida que la fecha de emisión de un presupuesto sea coherente con los presupuestos anteriores y siguientes.
   *
   * @param certificateNumber Número de certificado del presupuesto.
   * @param issuanceDate Fecha de emisión del presupuesto.
   * @param previousBudget Presupuesto anterior al actual.
   * @param nextBudget Presupuesto siguiente al actual.
   */
  #validateIssuanceDate(certificateNumber: number, issuanceDate: Date, previousBudget: any, nextBudget: any): void {
    // Validar que la fecha de emisión sea posterior o igual a la del presupuesto anterior
    if (previousBudget && issuanceDate < new Date(previousBudget.issuanceDate)) {
      throw new ConflictError(
        `Issuance date for certificate number ${certificateNumber} must be after or equal to ${previousBudget.certificateNumber} (${previousBudget.issuanceDate})`
      );
    }

    // Validar que la fecha de emisión sea anterior o igual a la del presupuesto siguiente
    if (nextBudget && issuanceDate > new Date(nextBudget.issuanceDate)) {
      throw new ConflictError(
        `Issuance date for certificate number ${certificateNumber} must be before or equal to ${nextBudget.certificateNumber} (${nextBudget.issuanceDate})`
      );
    }
  }
}
