import { Request, Response } from 'express';
import { IAuthController, IAuthService } from 'types';
import { handleError } from '@utils/handle-error';
import { InternalServerError } from '@utils/custom-errors';

export class AuthController implements IAuthController {
  #authService;
  constructor({ authService }: { authService: IAuthService }) {
    if (!authService) throw new InternalServerError('AuthService is not defined');
    this.#authService = authService;
  }

  register = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await this.#authService.register({ data: req.body });
      return res.status(201).send(user);
    } catch (error) {
      return handleError(error, res);
    }
  };

  async login(_req: Request, res: Response): Promise<any> {
    try {
      return await res.status(200).json({ message: 'Login successful' });
    } catch (error) {
      return handleError(error, res);
    }
  }

  async logout(_req: Request, res: Response): Promise<any> {
    try {
      return await res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
      handleError(error, res);
    }
  }
}
