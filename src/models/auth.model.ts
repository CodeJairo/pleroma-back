import { IAuthModel, IUser } from 'types';
import prisma from './prisma';
import { InternalServerError } from '@utils/custom-errors';

export class AuthModel implements IAuthModel {
  async register({ data }: { data: IUser }): Promise<any> {
    try {
      const user = await prisma.user.create({
        data: {
          ...data,
        },
      });
      const userReturn = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return userReturn;
    } catch (error) {
      throw new InternalServerError('Error registering user');
    }
  }

  async getUserByEmail({ email }: { email: string }): Promise<any> {
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

  async getUserById({ id }: { id: string }): Promise<any> {
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

  async getUserByUsername({ username }: { username: string }): Promise<any> {
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
