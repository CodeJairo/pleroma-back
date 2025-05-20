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
        throw new ConflictError('El número de certificado no es válido.');
      }

      // Validar que la fecha de emisión sea válida
      if (!data.issuanceDate || isNaN(new Date(data.issuanceDate).getTime())) {
        throw new ConflictError('La fecha de expedición no es válida.');
      }

      const certificateNumber = Number(data.certificateNumber);
      const issuanceDate = new Date(data.issuanceDate);

      // Verificar si ya existe un presupuesto con el mismo número de certificado
      const existingBudgetInfo = await this.#budgetModel.getBudgetInfo({ certificateNumber: data.certificateNumber, createdBy });
      if (existingBudgetInfo)
        throw new ConflictError(`Ya existe un presupuesto con el número de certificado ${data.certificateNumber}.`);

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
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo crear el presupuesto. Intenta nuevamente más tarde.');
    }
  }

  /**
   * Obtiene un presupuesto por número de certificado o todos los presupuestos de un usuario
   * y los ordena por número de certificado de manera ascendente.
   */
  async getBudgetInfo({ certificateNumber, createdBy }: { certificateNumber?: string; createdBy: string }) {
    try {
      const budgetInfo = certificateNumber
        ? await this.#budgetModel.getAllBudgetInfoByCertificateNumber({ certificateNumber, createdBy })
        : await this.#budgetModel.getAllBudgetInfo({ createdBy });

      // Ordenar los presupuestos por número de certificado de manera ascendente
      return this.#sortBudgetsByCertificateNumber(budgetInfo);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo obtener la información de los presupuestos. Intenta nuevamente más tarde.');
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
        `La fecha de expedición para el certificado número ${certificateNumber} debe ser posterior o igual a la del certificado anterior ('${
          previousBudget.certificateNumber
        }': ${this.#formatDateOnly(previousBudget.issuanceDate)}).`
      );
    }

    // Validar que la fecha de emisión sea anterior o igual a la del presupuesto siguiente
    if (nextBudget && issuanceDate > new Date(nextBudget.issuanceDate)) {
      throw new ConflictError(
        `La fecha de expedición para el certificado número ${certificateNumber} debe ser anterior o igual a la del siguiente certificado ('${
          nextBudget.certificateNumber
        }': ${this.#formatDateOnly(nextBudget.issuanceDate)}).`
      );
    }
  }

  #formatDateOnly(date: string | Date): string {
    // Si es string, pásalo a Date; si ya es Date, úsalo directo
    const d = typeof date === 'string' ? new Date(date) : date;
    // Formato YYYY-MM-DD
    return d.toISOString().split('T')[0];
  }
}
