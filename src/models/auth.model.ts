import { IAuthModel, IUserEntity, IUserRegister } from 'types';
import prisma from './prisma';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '@utils/index';

export class AuthModel implements IAuthModel {
  async register({ data }: { data: IUserRegister }): Promise<IUserEntity> {
    try {
      const user = await prisma.user.create({ data: { ...data } });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictError(error.meta.target[0] + ' already exists');
      throw new InternalServerError('Error registering user');
    }
  }

  async getUserByEmail({ email }: { email: string }) {
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

  async getUserById({ id }: { id: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });
      return user;
    } catch (error: any) {
      throw new InternalServerError('Error getting user by ID');
    }
  }

  async getUserByUsername({ username }: { username: string }) {
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

  async deleteUser({ id }: { id: string }) {
    try {
      await prisma.user.update({
        where: { id },
        data: {
          isActive: false,
        },
      });
      return;
    } catch (error: any) {
      console.log(error);
      if (error.code === 'P2023') throw new BadRequestError('Invalid id');
      if (error.code === 'P2025') throw new NotFoundError('User not found');
      throw new InternalServerError('Error deleting user');
    }
  }

  async updateUser({ id, data }: { id: string; data: Partial<IUserRegister> }) {
    try {
      await prisma.user.update({
        where: { id },
        data: {
          ...data,
        },
      });
      return;
    } catch (error: any) {
      if (error.code === 'P2025') throw new NotFoundError('User not found');
      if (error.code === 'P2002') throw new ConflictError(error.meta.target[0] + ' already exists');
      throw new InternalServerError('Error updating user');
    }
  }
}
