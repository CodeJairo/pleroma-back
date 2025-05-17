import { Request, Response, NextFunction } from 'express';
import {
  verifyToken,
  InternalServerError,
  UnauthorizedError,
  generateToken,
  setAuthCookie,
  redisClient,
  clearAuthCookie,
  generateRedisKey,
  setRedisCache,
  ForbiddenError,
} from '@utils/index';
import { IAuthMiddleware, IAuthService } from 'types';

export class AuthMiddleware implements IAuthMiddleware {
  #authService;
  constructor({ authService }: { authService: IAuthService }) {
    if (!authService) throw new InternalServerError('AuthService is not defined');
    this.#authService = authService;
  }

  /**
   * Common method to validate token and check user status.
   *
   * @param token - The authentication token from the request.
   * @param res - The HTTP response object.
   * @param isAdminCheck - Flag to check if the user is an admin.
   * @throws {UnauthorizedError} If the user is not authenticated, not active, or token is blacklisted.
   */
  async #validateUserToken(token: string, res: Response, isAdminCheck: boolean = false) {
    // Check if the token is blacklisted
    const blacklistedTokenKey = generateRedisKey('blacklist', token);
    const isBlacklisted = await redisClient.get(blacklistedTokenKey);
    if (isBlacklisted) {
      clearAuthCookie(res);
      throw new UnauthorizedError('User is not authenticated');
    }

    // Verify the token and user status
    const decoded = verifyToken(token);
    const isActive = await this.#authService.isUserActive({ id: decoded.id });
    if (!isActive) {
      res.clearCookie('auth_token');
      throw new UnauthorizedError('User is not active');
    }

    if (isAdminCheck) {
      const isAdmin = await this.#authService.isUserAdmin({ id: decoded.id });
      if (!isAdmin) throw new ForbiddenError('User is not admin');
    }

    return decoded;
  }
  /**
   * Middleware to check if the user is authenticated.
   */
  isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.auth_token;
      if (!token) throw new UnauthorizedError('User is not authenticated');

      const decoded = await this.#validateUserToken(token, res);

      req.user = decoded;

      // Blacklist the previous token
      const blacklistedTokenKey = generateRedisKey('blacklist', token);
      await setRedisCache(blacklistedTokenKey, true, 60 * 60 * 24); // 1 day

      // Generate and set a new token
      const payload = { id: decoded.id, username: decoded.username };
      const newToken = generateToken(payload, '1d');
      setAuthCookie(res, newToken);
      req.token = newToken;

      next();
    } catch (error) {
      next(error);
    }
  };

  /**
   * Middleware to check if the authenticated user is an admin.
   */
  isAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies.auth_token;
      if (!token) throw new UnauthorizedError('User is not authenticated');

      const decoded = await this.#validateUserToken(token, res, true);

      req.user = decoded;

      // Blacklist the previous token
      const blacklistedTokenKey = generateRedisKey('blacklist', token);
      await setRedisCache(blacklistedTokenKey, true, 60 * 60 * 24); // 1 day

      // Generate and set a new token
      const payload = { id: decoded.id, username: decoded.username };
      const newToken = generateToken(payload, '1d');
      setAuthCookie(res, newToken);

      next();
    } catch (error) {
      next(error);
    }
  };
}
