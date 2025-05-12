import {
  ConflictError,
  CustomError,
  InternalServerError,
  hashPassword,
  comparePasswords,
  generateToken,
  NotFoundError,
  UnauthorizedError,
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

  async login({ data }: { data: IUserLogin }): Promise<string> {
    try {
      const user = await this.#authModel.getUserByEmail({ email: data.email });
      if (!user) throw new NotFoundError('User not found');
      if (!user.isActive) throw new UnauthorizedError('User is not active, please contact support');
      const isPasswordValid = await comparePasswords(data.password, user.password);
      if (!isPasswordValid) throw new UnauthorizedError('Invalid password');
      const payload = { id: user.id, username: user.username };
      const token = generateToken(payload, '1h');
      return token;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error logging in user');
    }
  }

  async isUserActive({ id }: { id: string }): Promise<boolean> {
    try {
      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('User not found');
      return user.isActive;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error checking user status');
    }
  }

  async isUserAdmin({ id }: { id: string }): Promise<boolean> {
    try {
      const user = await this.#authModel.getUserById({ id });
      if (!user) throw new NotFoundError('User not found');
      return user.role === 'ADMIN';
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error checking user status');
    }
  }
}
