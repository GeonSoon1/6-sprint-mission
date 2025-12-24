import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  users as userMocks,
  products as productMocks,
  articles as articleMocks,
  comments as commentMocks,
  productLikes as productLikeMocks,
  articleLikes as articleLikeMocks,
} from './mock.js';

const prisma = new PrismaClient();

async function main() {
  await prisma.productLike.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.product.deleteMany();
  await prisma.article.deleteMany();
  await prisma.user.deleteMany();

  const usersToCreate = [];
  for (const u of userMocks) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    usersToCreate.push({
      id: u.id,
      email: u.email,
      nickname: u.nickname,
      image: u.image,
      password: hashedPassword,
    });
  }

  await prisma.user.createMany({
    data: usersToCreate,
  });

  await prisma.product.createMany({
    data: productMocks.map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      tags: p.tags,
      userId: p.userId,
    })),
  });

  await prisma.article.createMany({
    data: articleMocks.map((a) => ({
      id: a.id,
      title: a.title,
      content: a.content,
      userId: a.userId,
    })),
  });

  await prisma.comment.createMany({
    data: commentMocks.map((c) => ({
      id: c.id,
      content: c.content,
      userId: c.userId,
      productId: c.productId,
      articleId: c.articleId,
    })),
  });

  await prisma.productLike.createMany({
    data: productLikeMocks.map((pl) => ({
      id: pl.id,
      userId: pl.userId,
      productId: pl.productId,
    })),
  });

  await prisma.articleLike.createMany({
    data: articleLikeMocks.map((al) => ({
      id: al.id,
      userId: al.userId,
      articleId: al.articleId,
    })),
  });
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
