import { ConflictError, CustomError, InternalServerError } from '@utils/index';
import { IAuthModel, IAuthService, IUser } from 'types';
import { hashPassword } from '@utils/index';

export class AuthService implements IAuthService {
  #authModel;
  constructor({ authModel }: { authModel: IAuthModel }) {
    this.#authModel = authModel;
  }

  async register({ data }: { data: IUser }): Promise<any> {
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
      const user = this.#authModel.register({ data: userData });
      return user;
    } catch (error) {
      if (error instanceof CustomError) throw error;
      throw new InternalServerError('Error registering user');
    }
  }
}
