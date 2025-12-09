import { Prisma, User } from '@prisma/client';
import prisma from '../libs/prismaClient';

export class UserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    return prisma.user.update({ where: { id }, data: { refreshToken } });
  }

  async updateRefreshTokenByEmail(email: string, refreshToken: string) {
    return prisma.user.update({ where: { email }, data: { refreshToken } });
  }

  async clearRefreshToken(userId: string) {
    return prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data });
  }
}
