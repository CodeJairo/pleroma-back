import { Request, Response } from 'express';
import { IAuthController, IAuthService } from 'types';
import { handleError, InternalServerError, setAuthCookie } from '@utils/index';

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
      const token = await this.#authService.login({ data: req.body });
      setAuthCookie(res, token.serverToken);
      return res.status(200).json({ clientToken: token.clientToken });
    } catch (error) {
      return handleError(error, res);
    }
  };

  updateUser = async (req: Request, res: Response): Promise<any> => {
    try {
      console.log('Token from cookie:', req.token);
      await this.#authService.updateUser({ id: req.user!.id, data: req.body });
      const clientToken = this.#authService.refreshClientToken({ id: req.user!.id, username: req.user!.username });
      const serverToken = await this.#authService.refreshServerToken(
        { id: req.user!.id, username: req.user!.username },
        req.cookies.auth_token
      );
      setAuthCookie(res, serverToken);
      return res.status(200).json({ clientToken });
    } catch (error) {
      return handleError(error, res);
    }
  };

  updateUserAsAdmin(_req: Request, _res: Response): Promise<any> {
    throw new Error('Method not implemented.');
  }

  deleteUser(_req: Request, _res: Response): Promise<any> {
    throw new Error('Method not implemented.');
  }
  activateUser(_req: Request, _res: Response): Promise<any> {
    throw new Error('Method not implemented.');
  }

  refreshToken = (req: Request, res: Response) => {
    try {
      const payload = { id: req.user!.id, username: req.user!.username };
      const clientToken = this.#authService.refreshClientToken(payload);
      return res.status(200).json({ clientToken });
    } catch (error) {
      return handleError(error, res);
    }
  };

  logout = async (req: Request, res: Response) => {
    try {
      await this.#authService.logout(req.cookies.auth_token);
      res.clearCookie('auth_token');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return handleError(error, res);
    }
  };
}
