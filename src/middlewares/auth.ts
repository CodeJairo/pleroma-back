import { Request, Response, NextFunction } from 'express';
import { verifyToken, handleError, InternalServerError, UnauthorizedError } from '@utils/index';
import { IAuthMiddleware, IAuthService } from 'types';

export class AuthMiddleware implements IAuthMiddleware {
  #authService;
  constructor({ authService }: { authService: IAuthService }) {
    if (!authService) throw new InternalServerError('AuthService is not defined');
    this.#authService = authService;
  }

  isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.auth_token;
      if (!token) throw new UnauthorizedError('No token provided');
      const decoded = verifyToken(token);
      const isActive = await this.#authService.isUserActive({ id: decoded.id });
      if (!isActive) throw new UnauthorizedError('User is not active');
      req.user = decoded;
      next();
    } catch (error) {
      handleError(error, res);
    }
  };

  isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.auth_token;
      if (!token) throw new UnauthorizedError('No token provided');
      const decoded = verifyToken(token);
      const isActive = await this.#authService.isUserActive({ id: decoded.id });
      if (!isActive) throw new UnauthorizedError('User is not active');
      const isAdmin = await this.#authService.isUserAdmin({ id: decoded.id });
      if (!isAdmin) throw new UnauthorizedError('User is not admin');
      req.user = decoded;
      next();
    } catch (error) {
      handleError(error, res);
    }
  };
}
