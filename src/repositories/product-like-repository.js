// TODO) Product-Like-Repository: 상품 좋아요 저장소
// &) Config Import
import prisma from '../config/prisma.js';

export const productLikeRepo = {
  // ?) 좋아요 조회
  findProductLike(userId, productId) {
    return prisma.productLike.findUnique({
      where: { userId_productId: { userId, productId } },
    });
  },

  // ?) 좋아요 등록
  createProductLike(userId, productId) {
    return prisma.productLike.create({ data: { userId, productId } });
  },

  // ?) 좋아요 취소
  deleteProductLike(userId, productId) {
    return prisma.productLike.delete({
      where: { userId_productId: { userId, productId } },
    });
  },

  // ?) 좋아요 목록 조회
  listLikedProducts(userId) {
    return prisma.productLike.findMany({
      where: { userId },
      select: {
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            imagePath: true,
            createdAt: true,
          },
        },
      },
    });
  },
};
