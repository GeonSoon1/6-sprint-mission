import { PrismaClient } from '@prisma/client';
import { mockUsers, mockArticles, mockProducts } from './mock';

const prisma = new PrismaClient();

async function main() {
  await prisma.productLike.deleteMany();
  await prisma.articleLike.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  for (const userData of mockUsers) {
    await prisma.user.create({
      data: userData,
    });
  }

  for (const articleData of mockArticles) {
    await prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        userId: articleData.userId,
        comments: {
          create: articleData.comments,
        },
      },
    });
  }

  for (const productData of mockProducts) {
    await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        tags: productData.tags,
        userId: productData.userId,
        comments: {
          create: productData.comments,
        },
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
