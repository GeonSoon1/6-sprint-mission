import prisma from '../lib/prisma';

class AuthRepository {
  findByNickname(nickname: string) {
    return prisma.user.findFirst({ where: { nickname } });
  }

  createUser(email: string, nickname: string, hashedPassword: string) {
    return prisma.user.create({
      data: { email, nickname, password: hashedPassword },
    });
  }

  findById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }
}

export default new AuthRepository();
