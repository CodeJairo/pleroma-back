import { IAuthModel, IUserModel, IUserRegister } from 'types';
import prisma from './prisma';
import { InternalServerError } from '@utils/custom-errors';

export class AuthModel implements IAuthModel {
  async register({ data }: { data: IUserRegister }): Promise<IUserModel> {
    try {
      const user = await prisma.user.create({ data: { ...data } });
      return user;
    } catch (error) {
      throw new InternalServerError('Error registering user');
    }
  }

  async getUserByEmail({ email }: { email: string }): Promise<IUserModel | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerError('Error getting user by email');
    }
  }

  async getUserById({ id }: { id: string }): Promise<IUserModel | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerError('Error getting user by ID');
    }
  }

  async getUserByUsername({ username }: { username: string }): Promise<IUserModel | null> {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: {
            equals: username,
            mode: 'insensitive',
          },
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerError('Error getting user by username');
    }
  }
}
