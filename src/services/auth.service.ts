import {
  BadRequestError,
  ConflictError,
  CustomError,
  ForbiddenError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
  comparePasswords,
  deleteRedisCache,
  generateRedisKey,
  generateToken,
  hashPassword,
  redisClient,
  setRedisCache,
} from '@utils/index';
import { IAuthModel, IAuthService, IUserLogin, IUserRegister } from 'types';

export class AuthService implements IAuthService {
  #authModel;
  constructor({ authModel }: { authModel: IAuthModel }) {
    this.#authModel = authModel;
  }

  async register({ data }: { data: IUserRegister }): Promise<void> {
    try {
      let userExists;
      userExists = await this.#authModel.getUserByEmail({ email: data.email });
      if (userExists) throw new ConflictError('Ya existe una cuenta con ese correo electrónico.');
      userExists = await this.#authModel.getUserByUsername({ username: data.username });
      if (userExists) throw new ConflictError('El nombre de usuario ya está en uso.');

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
      throw new InternalServerError('No se pudo registrar el usuario. Intenta nuevamente más tarde.');
    }
  }

  async login({ data }: { data: IUserLogin }) {
    try {
      const user = await this.#authModel.getUserByEmail({ email: data.email });
      if (!user) throw new NotFoundError('No existe una cuenta con ese correo electrónico.');
      if (!user.isActive) throw new UnauthorizedError('Tu usuario está inactivo. Por favor contacta al soporte.');
      const isPasswordValid = await comparePasswords(data.password, user.password);
      if (!isPasswordValid) throw new UnauthorizedError('La contraseña es incorrecta.');

      const payload = { id: user.id, username: user.username, role: user.role };
      const clientToken = generateToken(payload, '15m');
      const serverToken = generateToken(payload, '1d');

      return { clientToken, serverToken };
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo iniciar sesión. Intenta nuevamente más tarde.');
    }
  }

  refreshClientToken({ id, username }: { id: string; username: string }) {
    try {
      const isActiveUser = this.isUserActive({ id });
      if (!isActiveUser) throw new UnauthorizedError('Tu usuario está inactivo. Por favor contacta al soporte.');
      if (!id || !username) throw new UnauthorizedError('No tienes una sesión activa.');
      const payload = { id, username };
      return generateToken(payload, '15m');
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo renovar tu sesión. Intenta nuevamente más tarde.');
    }
  }

  async refreshServerToken(payload: { id: string; username: string }, token: string) {
    try {
      const blacklistedTokenKey = generateRedisKey('blacklist', token);
      await setRedisCache(blacklistedTokenKey, true, 60 * 60 * 24); // 1 día

      return generateToken(payload, '1d');
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo renovar tu sesión. Intenta nuevamente más tarde.');
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
      throw new InternalServerError('No se pudo actualizar el usuario. Intenta nuevamente más tarde.');
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
      throw new InternalServerError('No se pudo actualizar el usuario. Intenta nuevamente más tarde.');
    }
  }

  async logout(token: string) {
    try {
      if (token) {
        const blacklistedTokenKey = generateRedisKey('blacklist', token);
        await setRedisCache(blacklistedTokenKey, true, 60 * 60 * 24); // 1 día
      }
      return;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo cerrar la sesión. Intenta nuevamente más tarde.');
    }
  }

  async deleteUser({ id, adminId }: { id: string; adminId: string }) {
    try {
      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('No se encontró el usuario.');
      if (user.id === adminId) throw new ForbiddenError('No puedes eliminar tu propia cuenta.');
      if (user.role === 'ADMIN') throw new ForbiddenError('No puedes eliminar un usuario administrador.');
      if (!user.isActive) throw new BadRequestError('El usuario ya está inactivo.');
      await this.#authModel.updateUserAsAdmin({ id, data: { isActive: false } });
      const redisKey = generateRedisKey('user', id, 'isActive');
      await deleteRedisCache(redisKey);
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo eliminar el usuario. Intenta nuevamente más tarde.');
    }
  }

  async activateUser({ id }: { id: string }) {
    try {
      await this.#authModel.updateUserAsAdmin({ id, data: { isActive: true } });
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo activar el usuario. Intenta nuevamente más tarde.');
    }
  }

  async isUserActive({ id }: { id: string }) {
    try {
      const redisKey = generateRedisKey('user', id, 'isActive');
      const cachedValue = await redisClient.get(redisKey);

      if (cachedValue) console.log('Cached isActive value:', cachedValue);

      if (cachedValue) return true;
      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('No se encontró el usuario.');
      if (user.isActive) await setRedisCache(redisKey, true, 60 * 60 * 24);
      if (!user.isActive) await deleteRedisCache(redisKey);

      return user.isActive;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo verificar el estado del usuario. Intenta nuevamente más tarde.');
    }
  }

  async isUserAdmin({ id }: { id: string }) {
    try {
      const redisKey = generateRedisKey('user', id, 'isAdmin');
      const cachedValue = await redisClient.get(redisKey);
      if (cachedValue) console.log('Cached Admin value:', cachedValue);
      if (cachedValue) return true;

      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('No se encontró el usuario.');

      if (user.role === 'ADMIN') await setRedisCache(redisKey, true, 60 * 60 * 24);
      if (user.role !== 'ADMIN') await deleteRedisCache(redisKey);

      return user.role === 'ADMIN';
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('No se pudo verificar el estado del usuario. Intenta nuevamente más tarde.');
    }
  }

  //TODO: Implementar el update para cambiar el role y el isActive
  //TODO: Luego borrar el cache de redis
}
