import prisma from '../lib/prisma';

beforeEach(async () => {
  await prisma.$transaction([
    prisma.productLike.deleteMany(),
    prisma.product.deleteMany(),
    prisma.article.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.user.deleteMany(),
  ]);
});
afterAll(async () => {
  await prisma.$disconnect();
});
