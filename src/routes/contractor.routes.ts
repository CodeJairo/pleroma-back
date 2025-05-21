import { validateRequest } from '@middlewares/index';
import { validateJuridicalPerson, validateNaturalPerson } from '@schemas/index';
import { Router } from 'express';
import { IAuthMiddleware, IContractController } from 'types';

interface ContractRouterDependencies {
  contractController: IContractController;
  authMiddleware: IAuthMiddleware;
}

/**
 * @swagger
 * tags:
 *   name: Contract
 *   description: Endpoints de gestión de contratistas (personas naturales y jurídicas)
 */

export const createContractRouter = ({ contractController, authMiddleware }: ContractRouterDependencies) => {
  const contractRouter = Router();

  // Middleware de autenticación para todas las rutas
  contractRouter.use(authMiddleware.isAuthenticated);

  // =========================
  // SECCIÓN: PERSONA JURÍDICA
  // =========================

  /**
   * @swagger
   * /contract/create-juridical-person:
   *   post:
   *     summary: Crear una persona jurídica
   *     description: Crea una persona jurídica. Solo usuarios autenticados pueden acceder.
   *     tags: [Contract]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       description: Datos de la persona jurídica a crear
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/JuridicalPerson'
   *           example:
   *             businessName: "Empresa S.A."
   *             businessDocumentNumber: "900123456"
   *             name: "Representante Legal"
   *             documentType: "CC"
   *             documentNumber: "1234567890"
   *             expeditionAddress: "Bogotá"
   *             birthDate: "1980-01-01"
   *             genre: "M"
   *             address: "Calle 123 #45-67"
   *             phone: "3001234567"
   *             email: "empresa@email.com"
   *             bank: "Bancolombia"
   *             accountType: "AHORROS"
   *             bankAccountNumber: "1234567890"
   *     responses:
   *       201:
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
   * /contract/get-all-juridical-person:
   *   get:
   *     summary: Obtener todas las personas jurídicas
   *     description: Obtiene todas las personas jurídicas creadas por el usuario autenticado. Puede filtrarse por número de documento.
   *     tags: [Contract]
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

  // =========================
  // SECCIÓN: PERSONA NATURAL
  // =========================

  /**
   * @swagger
   * /contract/create-natural-person:
   *   post:
   *     summary: Crear una persona natural
   *     description: Crea una persona natural. Solo usuarios autenticados pueden acceder.
   *     tags: [Contract]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       description: Datos de la persona natural a crear
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/NaturalPerson'
   *           example:
   *             name: "Juan Pérez"
   *             documentType: "CC"
   *             documentNumber: "1234567890"
   *             expeditionAddress: "Bogotá"
   *             birthDate: "1990-01-01"
   *             genre: "M"
   *             address: "Calle 45 #67-89"
   *             phone: "3009876543"
   *             email: "juan@email.com"
   *             bank: "Davivienda"
   *             accountType: "AHORROS"
   *             bankAccountNumber: "9876543210"
   *     responses:
   *       201:
   *         description: Persona natural creada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Persona natural creada exitosamente
   *       400:
   *         description: Datos inválidos
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  contractRouter.post('/create-natural-person', validateRequest(validateNaturalPerson), contractController.createNaturalPerson);

  /**
   * @swagger
   * /contract/get-all-natural-person:
   *   get:
   *     summary: Obtener todas las personas naturales
   *     description: Obtiene todas las personas naturales creadas por el usuario autenticado. Puede filtrarse por número de documento.
   *     tags: [Contract]
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
   *         description: Lista de personas naturales obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/NaturalPerson'
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  contractRouter.get('/get-all-natural-person', contractController.getAllNaturalPerson);

  // =========================
  // SECCIÓN: GENERAL
  // =========================

  /**
   * @swagger
   * /contract/get-all-contractors:
   *   get:
   *     summary: Obtener todos los contratistas
   *     description: Obtiene todos los contratistas (personas naturales y jurídicas) creados por el usuario autenticado.
   *     tags: [Contract]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Lista de contratistas obtenida exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Contractor'
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  contractRouter.get('/get-all-contractors', contractController.getAllContractors);

  return contractRouter;
};
