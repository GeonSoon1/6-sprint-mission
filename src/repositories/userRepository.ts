import { prismaClient } from '../lib/prismaClient.js';
import { User } from '@prisma/client';
import { CreateUserDTO, UpdateUserDTO } from '../types/dto.js';

export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prismaClient.user.findUnique({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return prismaClient.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserDTO & { password: string }): Promise<User> {
    return prismaClient.user.create({ data });
  }

  async update(id: number, data: UpdateUserDTO): Promise<User> {
    return prismaClient.user.update({ where: { id }, data });
  }

  async updatePassword(id: number, password: string): Promise<User> {
    return prismaClient.user.update({ where: { id }, data: { password } });
  }
}

export const userRepository = new UserRepository();


