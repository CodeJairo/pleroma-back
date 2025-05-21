import { validateRequest } from '@middlewares/index';
import { validateLogin, validateUpdateUser, validateUpdateUserAsAdmin, validateUser } from '@schemas/index';
import { Router } from 'express';
import { IAuthController, IAuthMiddleware } from 'types';

interface AuthRouterDependencies {
  authController: IAuthController;
  authMiddleware: IAuthMiddleware;
}

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación y gestión de usuarios
 */

export const createAuthRouter = ({ authController, authMiddleware }: AuthRouterDependencies) => {
  const authRouter = Router();

  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Registrar un nuevo usuario
   *     description: Acceso restringido a usuarios con rol de administrador.
   *     tags:
   *       - Auth
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserRegister'
   *           example:
   *             username: "usuario123"
   *             email: "usuario@email.com"
   *             password: "Password123$"
   *     responses:
   *       201:
   *         description: Usuario registrado exitosamente.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuario registrado exitosamente
   *       401:
   *         description: Usuario no autenticado.
   *       403:
   *         description: Acceso denegado. Se requieren privilegios de administrador.
   *       409:
   *         description: El email o nombre de usuario ya existe.
   */
  authRouter.post('/register', authMiddleware.isAdmin, validateRequest(validateUser), authController.register);

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Iniciar sesión
   *     description: Endpoint para iniciar sesión. Devuelve un token de acceso (cliente) y un token de actualización (servidor) mediante cookie.
   *     tags:
   *       - Auth
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserLogin'
   *           example:
   *             email: "usuario@email.com"
   *             password: "Password123$"
   *     responses:
   *       200:
   *         description: Inicio de sesión exitoso. Devuelve token de acceso y configura cookie con token de actualización.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 clientToken:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  authRouter.post('/login', validateRequest(validateLogin), authController.login);

  /**
   * @swagger
   * /auth/update:
   *   patch:
   *     summary: Actualizar usuario
   *     description: Endpoint para actualizar el usuario autenticado. Devuelve un token de acceso y un token de actualización.
   *     tags:
   *       - Auth
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserUpdate'
   *           example:
   *             username: "usuario123"
   *             email: "nuevo@email.com"
   *             password: "NuevoPassword123$"
   *     responses:
   *       200:
   *         description: Usuario actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 clientToken:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  authRouter.patch('/update', authMiddleware.isAuthenticated, validateRequest(validateUpdateUser), authController.updateUser);

  /**
   * @swagger
   * /auth/update/{id}:
   *   patch:
   *     summary: Actualizar usuario como administrador
   *     description: Endpoint para actualizar un usuario como administrador. Solo los administradores pueden acceder a este endpoint.
   *     tags:
   *       - Auth
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del usuario a actualizar
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UserUpdateAsAdmin'
   *           example:
   *             username: "usuario123"
   *             email: "nuevo@email.com"
   *             password: "NuevoPassword123$"
   *             role: "ADMIN"
   *             isActive: true
   *     responses:
   *       200:
   *         description: Usuario actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuario actualizado exitosamente
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   *       403:
   *         description: Acceso denegado. Se requieren privilegios de administrador.
   *       404:
   *         description: Usuario no encontrado
   */
  authRouter.patch(
    '/update/:id',
    authMiddleware.isAdmin,
    validateRequest(validateUpdateUserAsAdmin),
    authController.updateUserAsAdmin
  );

  /**
   * @swagger
   * /auth/refresh-token:
   *   post:
   *     summary: Actualizar token de acceso
   *     description: Endpoint para actualizar el token de acceso. Devuelve un nuevo token de acceso.
   *     tags:
   *       - Auth
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Token actualizado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 clientToken:
   *                   type: string
   *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXvCJ9...
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  authRouter.post('/refresh-token', authMiddleware.isAuthenticated, authController.refreshToken);

  /**
   * @swagger
   * /auth/logout:
   *   post:
   *     summary: Cerrar sesión
   *     description: Endpoint para cerrar sesión. Elimina el token de acceso y el token de actualización.
   *     tags:
   *       - Auth
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Sesión cerrada exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Sesión cerrada exitosamente
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   */
  authRouter.post('/logout', authController.logout);

  /**
   * @swagger
   * /auth/delete/{id}:
   *   delete:
   *     summary: Eliminar usuario
   *     description: Endpoint para eliminar un usuario. Solo los administradores pueden acceder a este endpoint.
   *     tags:
   *       - Auth
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del usuario a eliminar
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Usuario eliminado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuario eliminado exitosamente
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   *       403:
   *         description: Acceso denegado. Se requieren privilegios de administrador.
   *       404:
   *         description: Usuario no encontrado
   */
  authRouter.delete('/delete/:id', authMiddleware.isAdmin, authController.deleteUser);

  /**
   * @swagger
   * /auth/activate/{id}:
   *   patch:
   *     summary: Activar usuario
   *     description: Endpoint para activar un usuario. Solo los administradores pueden acceder a este endpoint.
   *     tags:
   *       - Auth
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         description: ID del usuario a activar
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Usuario activado exitosamente
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   example: Usuario activado exitosamente
   *       401:
   *         description: Credenciales inválidas o usuario no autorizado
   *       403:
   *         description: Acceso denegado. Se requieren privilegios de administrador.
   *       404:
   *         description: Usuario no encontrado
   */
  authRouter.patch('/activate/:id', authMiddleware.isAdmin, authController.activateUser);

  return authRouter;
};
