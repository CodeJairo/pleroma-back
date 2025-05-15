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

  async logout(_req: Request, res: Response) {
    try {
      res.clearCookie('auth_token');
      return res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      return handleError(error, res);
    }
  }
}
