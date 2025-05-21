import { validateRequest } from '@middlewares/index';
import { validateBudgetInformation } from '@schemas/index';
import { Router } from 'express';
import { IAuthMiddleware, IBudgetController } from 'types';

interface IBudgetRouterDependencies {
  budgetController: IBudgetController;
  authMiddleware: IAuthMiddleware;
}

export const createBudgetInfoRouter = ({ budgetController, authMiddleware }: IBudgetRouterDependencies) => {
  const budgetInfoRouter = Router();
  budgetInfoRouter.use(authMiddleware.isAuthenticated);

  /**
   * @swagger
   * tags:
   *   name: Budget
   *   description: Endpoints de gestión de presupuestos
   */

  /**
   * @swagger
   * /budget/create-budget-info:
   *   post:
   *     summary: Crear información de presupuesto
   *     description: Crea un nuevo presupuesto con validaciones de número de certificado y fechas. Solo usuarios autenticados pueden acceder.
   *     tags:
   *       - Budget
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       description: Información del presupuesto a crear
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/BudgetInformation'
   *           example:
   *             certificateNumber: "CERT-2025-001"
   *             issuanceDate: "2025-05-21"
   *             totalAssignedAmount: 1000000
   *             rubros:
   *               - name: "Rubro 1"
   *                 code: "R1"
   *                 assignedAmount: 500000
   *               - name: "Rubro 2"
   *                 code: "R2"
   *                 assignedAmount: 500000
   *     responses:
   *       201:
   *         description: Información de presupuesto creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Información de presupuesto creada exitosamente
   *       400:
   *         description: Datos inválidos o número de certificado o fecha inválida
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   *       403:
   *         description: Acceso denegado. Se requieren privilegios de administrador.
   *       409:
   *         description: Número de certificado duplicado
   */

  budgetInfoRouter.post('/create-budget-info', validateRequest(validateBudgetInformation), budgetController.createBudgetInfo);

  /**
   * @swagger
   * /budget/get-budget-info:
   *   get:
   *     summary: Obtener información de presupuesto
   *     description: Obtiene la información de presupuestos filtrada opcionalmente por número de certificado. Solo usuarios autenticados pueden acceder.
   *     tags:
   *       - Budget
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: query
   *         name: certificateNumber
   *         schema:
   *           type: string
   *         description: Número de certificado para filtrar
   *     responses:
   *       200:
   *         description: Información de presupuesto obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/BudgetInformation'
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   *       403:
   *         description: Acceso denegado. Se requieren privilegios de administrador.
   */
  budgetInfoRouter.get('/get-budget-info', budgetController.getAllBudgetInfo);

  return budgetInfoRouter;
};
