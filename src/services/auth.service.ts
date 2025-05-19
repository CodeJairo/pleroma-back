import {
  ConflictError,
  CustomError,
  InternalServerError,
  hashPassword,
  comparePasswords,
  generateToken,
  NotFoundError,
  UnauthorizedError,
  redisClient,
  generateRedisKey,
  setRedisCache,
  deleteRedisCache,
  BadRequestError,
  ForbiddenError,
} from '@utils/index';
import { IAuthModel, IAuthService, IUserRegister, IUserLogin } from 'types';

export class AuthService implements IAuthService {
  #authModel;
  constructor({ authModel }: { authModel: IAuthModel }) {
    this.#authModel = authModel;
  }

  async register({ data }: { data: IUserRegister }): Promise<void> {
    try {
      let userExists;
      userExists = await this.#authModel.getUserByEmail({ email: data.email });
      if (userExists) throw new ConflictError('Email already exists');
      userExists = await this.#authModel.getUserByUsername({ username: data.username });
      if (userExists) throw new ConflictError('Username already exists');

      const hashedPassword = await hashPassword(data.password);
      const userData = {
        ...data,
        email: data.email.toLowerCase(),
        password: hashedPassword,
      };
      await this.#authModel.register({ data: userData });
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error registering user');
    }
  }

  async login({ data }: { data: IUserLogin }) {
    try {
      const user = await this.#authModel.getUserByEmail({ email: data.email });
      if (!user) throw new NotFoundError('User not found');
      if (!user.isActive) throw new UnauthorizedError('User is not active, please contact support');
      const isPasswordValid = await comparePasswords(data.password, user.password);
      if (!isPasswordValid) throw new UnauthorizedError('Invalid password');

      const payload = { id: user.id, username: user.username, role: user.role };
      const clientToken = generateToken(payload, '15m');
      const serverToken = generateToken(payload, '1d');

      return { clientToken, serverToken };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error logging in user');
    }
  }

  refreshClientToken({ id, username }: { id: string; username: string }) {
    try {
      const isActiveUser = this.isUserActive({ id });
      if (!isActiveUser) throw new UnauthorizedError('User is not active, please contact support');
      if (!id || !username) throw new UnauthorizedError('User is not authenticated');
      const payload = { id, username };
      return generateToken(payload, '15m');
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error refreshing token');
    }
  }

  async refreshServerToken(payload: { id: string; username: string }, token: string) {
    try {
      const blacklistedTokenKey = generateRedisKey('blacklist', token);
      await setRedisCache(blacklistedTokenKey, true, 60 * 60 * 24); // 1 day

      return generateToken(payload, '1d');
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error refreshing token');
    }
  }

  async updateUser({ id, username, token, data }: { id: string; username: string; token: string; data: Partial<IUserRegister> }) {
    try {
      await this.#authModel.updateUser({ id, data });
      const redisKey = generateRedisKey('user', id, 'isActive');
      const redisKey2 = generateRedisKey('user', id, 'isAdmin');
      await deleteRedisCache(redisKey);
      await deleteRedisCache(redisKey2);
      const clientToken = this.refreshClientToken({ id, username });
      const serverToken = await this.refreshServerToken({ id, username }, token);
      return { clientToken, serverToken };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error updating user');
    }
  }

  async updateUserAsAdmin({ id, data }: { id: string; data: Partial<IUserRegister> }) {
    try {
      await this.#authModel.updateUserAsAdmin({ id, data });
      const redisKey = generateRedisKey('user', id, 'isActive');
      const redisKey2 = generateRedisKey('user', id, 'isAdmin');
      await deleteRedisCache(redisKey);
      await deleteRedisCache(redisKey2);
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error updating user');
    }
  }

  async logout(token: string) {
    try {
      if (token) {
        const blacklistedTokenKey = generateRedisKey('blacklist', token);
        await setRedisCache(blacklistedTokenKey, true, 60 * 60 * 24); // 1 day
      }
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error logging out user');
    }
  }

  async deleteUser({ id, adminId }: { id: string; adminId: string }) {
    try {
      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('User not found');
      if (user.id === adminId) throw new ForbiddenError('Cannot delete your own account');
      if (user.role === 'ADMIN') throw new ForbiddenError('Cannot delete an admin user');
      if (!user.isActive) throw new BadRequestError('User is already inactive');
      await this.#authModel.updateUserAsAdmin({ id, data: { isActive: false } });
      const redisKey = generateRedisKey('user', id, 'isActive');
      await deleteRedisCache(redisKey);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error deleting user');
    }
  }

  async activateUser({ id }: { id: string }) {
    try {
      await this.#authModel.updateUserAsAdmin({ id, data: { isActive: true } });
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error activating user');
    }
  }

  async isUserActive({ id }: { id: string }) {
    try {
      const redisKey = generateRedisKey('user', id, 'isActive');
      const cachedValue = await redisClient.get(redisKey);

      if (cachedValue) console.log('Cached isActive value:', cachedValue);

      if (cachedValue) return true;
      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('User not found');
      if (user.isActive) await setRedisCache(redisKey, true, 60 * 60 * 24);
      if (!user.isActive) await deleteRedisCache(redisKey);

      return user.isActive;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error checking user status');
    }
  }

  async isUserAdmin({ id }: { id: string }) {
    try {
      const redisKey = generateRedisKey('user', id, 'isAdmin');
      const cachedValue = await redisClient.get(redisKey);
      if (cachedValue) console.log('Cached Admin value:', cachedValue);
      if (cachedValue) return true;

      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('User not found');

      if (user.role === 'ADMIN') await setRedisCache(redisKey, true, 60 * 60 * 24);
      if (user.role !== 'ADMIN') await deleteRedisCache(redisKey);

      return user.role === 'ADMIN';
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error checking user status');
    }
  }

  //TODO: Implementar el update para cambiar el role y el isActive
  //TODO: Luego borrar el cache de redis
}
