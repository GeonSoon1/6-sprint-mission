// TODO) Product-Comment-Repository: DB 저장소
// &) Config Import
import prisma from '../config/prisma.js';

export const productCommentRepo = {
  // ?) 댓글 목록 조회
  findCommentsByProduct(productId) {
    return prisma.productComment.findMany({
      where: { productId },
      orderBy: { createdAt: 'asc' },
      select: {
        id: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });
  },

  // ?) 특정 댓글 조회
  findProductCommentById(id) {
    return prisma.productComment.findUnique({
      where: { id },
      select: {
        id: true,
        productId: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });
  },

  // ?) 댓글 생성
  createProductComment(data) {
    return prisma.productComment.create({ data });
  },

  // ?) 댓글 수정
  updateProductComment(id, data) {
    return prisma.productComment.update({ where: { id }, data });
  },

  // ?) 댓글 삭제
  deleteProductComment(id) {
    return prisma.productComment.delete({ where: { id } });
  },
};
