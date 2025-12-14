import prisma from '../lib/prismaClient';

export function findUserByEmail(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export function findUserByNickname(nickname: string) {
  return prisma.user.findUnique({ where: { nickname } });
}

export function findUserById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export function createUser(data: {
  email: string;
  nickname: string;
  password: string;
}) {
  return prisma.user.create({ data });
}

export function updateUserById(
  id: string,
  data: { email?: string; nickname?: string; image?: string; password?: string }
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
