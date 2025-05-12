import { Request, Response } from 'express';
import { IAuthController, IAuthService } from 'types';
import { handleError } from '@utils/handle-error';
import { InternalServerError } from '@utils/custom-errors';
import config from 'config/config';

export class AuthController implements IAuthController {
  #authService;
  constructor({ authService }: { authService: IAuthService }) {
    if (!authService) throw new InternalServerError('AuthService is not defined');
    this.#authService = authService;
  }

  register = async (req: Request, res: Response): Promise<any> => {
    try {
      await this.#authService.register({ data: req.body });
      return res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  login = async (req: Request, res: Response): Promise<any> => {
    try {
      const token: string = await this.#authService.login({ data: req.body });
      this.#setAuthCookie(res, token);
      return res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      return handleError(error, res);
    }
  };

  async logout(_req: Request, res: Response): Promise<any> {
    try {
      return await res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      handleError(error, res);
    }
  }

  #setAuthCookie = (res: Response, token: string) => {
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: config.nodeEnvironment === 'production',
      sameSite: 'none',
      maxAge: 1000 * 60 * 60, // 1 hour
    });
  };
}
