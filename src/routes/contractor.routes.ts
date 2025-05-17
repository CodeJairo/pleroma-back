import { Router } from 'express';
import { IContractController, IAuthMiddleware } from 'types';
import { validateRequest } from '@middlewares/index';
import { validateJuridicalPerson } from '@schemas/index';

interface ContractRouterDependencies {
  contractController: IContractController;
  authMiddleware: IAuthMiddleware;
}

/**
 * @swagger
 * tags:
 *   name: Contract
 *   description: Endpoints de gestión de contratistas
 */

export const createContractRouter = ({ contractController, authMiddleware }: ContractRouterDependencies) => {
  const contractRouter = Router();

  contractRouter.use(authMiddleware.isAuthenticated);

  /**
   * @swagger
   * /contractor/create-juridical-person:
   *   post:
   *     summary: Crear una persona jurídica
   *     description: Endpoint para crear una persona jurídica. Solo usuarios autenticados pueden acceder.
   *     tags:
   *       - Contract
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       description: Datos de la persona jurídica a crear
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/JuridicalPerson'
   *     responses:
   *       200:
   *         description: Persona jurídica creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Persona jurídica creada exitosamente
   *       400:
   *         description: Datos inválidos
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   *       409:
   *         description: Persona jurídica ya existe
   */
  contractRouter.post('/create-juridical-person', validateRequest(validateJuridicalPerson), contractController.createJuridicalPerson);

  /**
   * @swagger
   * /contractor/get-all-juridical-person:
   *   get:
   *     summary: Obtener todas las personas jurídicas
   *     description: Endpoint para obtener todas las personas jurídicas creadas por el usuario autenticado. Puede filtrarse por número de documento.
   *     tags:
   *       - Contract
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: query
   *         name: document
   *         schema:
   *           type: string
   *         description: Número de documento para filtrar resultados (opcional)
   *     responses:
   *       200:
   *         description: Lista de personas jurídicas obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/JuridicalPerson'
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  contractRouter.get('/get-all-juridical-person', contractController.getAllJuridicalPerson);

  return contractRouter;
};
