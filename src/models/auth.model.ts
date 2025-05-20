import { IAuthModel, IUserEntity, IUserRegister } from 'types';
import prisma from './prisma';
import { BadRequestError, ConflictError, InternalServerError, NotFoundError } from '@utils/index';

export class AuthModel implements IAuthModel {
  async register({ data }: { data: IUserRegister }): Promise<IUserEntity> {
    try {
      const user = await prisma.user.create({ data: { ...data } });
      return user;
    } catch (error: any) {
      if (error.code === 'P2002') throw new ConflictError('Ya existe un usuario con ese correo electrónico o nombre de usuario.');
      throw new InternalServerError('No se pudo registrar el usuario. Intenta nuevamente más tarde.');
    }
  }

  async getUserByEmail({ email }: { email: string }) {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email: email.toLowerCase(),
        },
      });
      if (user) return user;
      return null;
    } catch (error) {
      throw new InternalServerError('No se pudo consultar el usuario. Intenta nuevamente más tarde.');
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
      throw new InternalServerError('No se pudo consultar el usuario. Intenta nuevamente más tarde.');
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
      throw new InternalServerError('No se pudo consultar el usuario. Intenta nuevamente más tarde.');
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
      if (error.code === 'P2025') throw new NotFoundError('No se encontró el usuario.');
      if (error.code === 'P2002') throw new ConflictError('El correo electrónico o nombre de usuario ya están en uso.');
      throw new InternalServerError('No se pudo actualizar el usuario. Intenta nuevamente más tarde.');
    }
  }

  async updateUserAsAdmin({ id, data }: { id: string; data: Partial<IUserEntity> }) {
    try {
      await prisma.user.update({
        where: { id },
        data: {
          ...data,
        },
      });
      return;
    } catch (error: any) {
      if (error.code === 'P2023') throw new BadRequestError('El identificador proporcionado no es válido.');
      if (error.code === 'P2025') throw new NotFoundError('No se encontró el usuario.');
      throw new InternalServerError('No se pudo actualizar el usuario. Intenta nuevamente más tarde.');
    }
  }
}
