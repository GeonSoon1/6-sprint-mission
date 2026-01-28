import prisma from '../../libs/prismaClient';

export class LikeRepository {
  // Product Like
  async productFindProductById(productId: string) {
    return prisma.product.findUniqueOrThrow({ where: { id: productId } });
  }

  async productFindExistingLike(userId: string, productId: string) {
    return prisma.likedProduct.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  }

  async productCreateLike(userId: string, productId: string) {
    return prisma.likedProduct.create({ data: { userId, productId } });
  }

  async productDeleteLike(userId: string, productId: string) {
    return prisma.likedProduct.delete({
      where: { userId_productId: { userId, productId } },
    });
  }

  async productIncrementLike(productId: string) {
    return prisma.product.update({
      where: { id: productId },
      data: { productLikeCount: { increment: 1 } },
    });
  }

  async productDecrementLike(productId: string) {
    return prisma.product.update({
      where: { id: productId, productLikeCount: { gt: 0 } },
      data: { productLikeCount: { decrement: 1 } },
    });
  }

  async getLikedProducts(userId: string) {
    return prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        likedProducts: {
          select: { product: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  // Article Like
  async articleFindArticleById(articleId: string) {
    return prisma.article.findUniqueOrThrow({ where: { id: articleId } });
  }

  async articleFindExistingLike(userId: string, articleId: string) {
    return prisma.likedArticle.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  }

  async articleCreateLike(userId: string, articleId: string) {
    return prisma.likedArticle.create({ data: { userId, articleId } });
  }

  async articleDeleteLike(userId: string, articleId: string) {
    return prisma.likedArticle.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  }

  async articleIncrementLike(articleId: string) {
    return prisma.article.update({
      where: { id: articleId },
      data: { articleLikeCount: { increment: 1 } },
    });
  }

  async articleDecrementLike(articleId: string) {
    return prisma.article.update({
      where: { id: articleId, articleLikeCount: { gt: 0 } },
      data: { articleLikeCount: { decrement: 1 } },
    });
  }

  async getLikedArticles(userId: string) {
    return prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        likedArticles: {
          select: { article: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }
}
