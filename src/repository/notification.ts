import prisma from '../lib/prismaClient';

async function create(data) {
  return prisma.notification.create({ data });
};
