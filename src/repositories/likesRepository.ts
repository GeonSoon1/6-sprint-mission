import { prisma } from '../utils/prisma';

const findProductLike = async (userId: string, productId: string) => {
  return prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

const createProductLike = async (userId: string, productId: string) => {
  return prisma.productLike.create({
    data: { userId, productId },
  });
};

const deleteProductLike = async (id: string) => {
  return prisma.productLike.delete({
    where: { id },
  });
};

const findArticleLike = async (userId: string, articleId: string) => {
  return prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
};

const createArticleLike = async (userId: string, articleId: string) => {
  return prisma.articleLike.create({
    data: { userId, articleId },
  });
};

const deleteArticleLike = async (id: string) => {
  return prisma.articleLike.delete({
    where: { id },
  });
};

export const likesRepository = {
  findProductLike,
  createProductLike,
  deleteProductLike,
  findArticleLike,
  createArticleLike,
  deleteArticleLike,
};
