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

      const payload = { id: user.id, username: user.username };
      const clientToken = generateToken(payload, '1h');
      const serverToken = generateToken(payload, '1d');

      return { clientToken, serverToken };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error logging in user');
    }
  }

  refreshToken(payload: { id: string; username: string }) {
    return generateToken(payload, '1h');
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
