// TODO) Product-Repository: DB 저장소
// &) Config Import
import prisma from '../config/prisma.js';

export const productRepo = {
  // ?) 상품 목록 조회
  findProducts(where, orderBy, offset, limit) {
    return prisma.product.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        createdAt: true,
        imagePath: true,
      },
    });
  },

  // ?) 상품 단건 조회
  findProductById(id) {
    return prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        tags: true,
        stock: true,
        imagePath: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  },

  // ?) 상품 생성
  createProduct(data) {
    return prisma.product.create({ data });
  },

  // ?) 상품 수정
  updateProduct(id, data) {
    return prisma.product.update({ where: { id }, data });
  },

  // ?) 상품 삭제
  deleteProduct(id) {
    return prisma.product.delete({ where: { id } });
  },

  // ?) 상품 구매 트랜잭션
  purchaseProductTx(productId, quantity, unitPrice) {
    return prisma.$transaction(async (pr) => {
      const updated = await pr.product.update({
        where: { id: productId },
        data: { stock: { decrement: quantity } },
        select: { id: true, name: true, stock: true },
      });

      const purchase = await pr.purchase.create({
        data: { productId, quantity, unitPrice },
      });

      return { updated, purchase };
    });
  },

  // ?) 유저가 등록한 상품 조회
  findProductsByUser(userId) {
    return prisma.product.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        imagePath: true,
        createdAt: true,
      },
    });
  },
};
