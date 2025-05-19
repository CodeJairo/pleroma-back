import { Request, Response } from 'express';
import { IAuthController, IAuthService } from 'types';
import { handleError, InternalServerError, setAuthCookie, setClientCookie } from '@utils/index';
import config from 'config/config';

export class AuthController implements IAuthController {
  #authService;
  constructor({ authService }: { authService: IAuthService }) {
    if (!authService) throw new InternalServerError('AuthService is not defined');
    this.#authService = authService;
  }

  register = async (req: Request, res: Response) => {
    try {
      await this.#authService.register({ data: req.body });
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      res.clearCookie(config.serverCookieKey);
      res.clearCookie(config.clientCookieKey);
      const token = await this.#authService.login({ data: req.body });
      setAuthCookie(res, token.serverToken);
      setClientCookie(res, token.clientToken);
      return res.status(200).json({ clientToken: token.clientToken });
    } catch (error) {
      return handleError(error, res);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      console.log('La petición paso por el controlador');
      const token = await this.#authService.updateUser({
        id: req.user!.id,
        username: req.user!.username,
        token: req.cookies.auth_token,
        data: req.body,
      });
      setAuthCookie(res, token.serverToken);
      return res.status(200).json({ clientToken: token.clientToken });
    } catch (error) {
      return handleError(error, res);
    }
  };

  updateUserAsAdmin = async (req: Request, res: Response) => {
    try {
      await this.#authService.updateUserAsAdmin({ id: req.params.id, data: req.body });
      return res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      await this.#authService.deleteUser({ id: req.params.id, adminId: req.user!.id });
      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  activateUser = async (req: Request, res: Response) => {
    try {
      await this.#authService.activateUser({ id: req.params.id });
      return res.status(200).json({ message: 'User activated successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  refreshToken = (req: Request, res: Response) => {
    try {
      const clientToken = this.#authService.refreshClientToken({ id: req.user?.id, username: req.user?.username });
      setClientCookie(res, clientToken);
      return res.status(200).json({ clientToken });
    } catch (error) {
      return handleError(error, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      await this.#authService.logout(req.cookies[config.serverCookieKey]);
      res.clearCookie(config.serverCookieKey);
      res.clearCookie(config.clientCookieKey);
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return handleError(error, res);
    }
  };
}
