import prisma from '../lib/prisma.js';

/**
 * 특정 사용자가 특정 상품을 좋아하는지 확인합니다.
 * @param {string} userId  - 사용자 ID
 * @param {string} productId - 상품 ID
 * @returns {Promise<object|null>} - ProductLike 객체 또는 null
 */
export const findProductLike = async (userId, productId) => {
  return prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });
};

/**
 * 상품에 '좋아요'를 추가하고, 상품의 likeCount를 1 증가시킵니다.
 * @param {string} userId - 사용자 ID
 * @param {string} productId - 상품 ID
 * @returns {Promise<object>} - 생성된 ProductLike 객체
 */
export const createProductLike = async (userId, productId) => {
  return prisma.$transaction(async (tx) => {
    const newLike = await tx.productLike.create({
      data: {
        userId,
        productId,
      },
    });
    const product = await tx.product.update({
      where: { id: productId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
      select: { likeCount: true },
    });

    // return newLike;
    return product.likeCount;
  });
};

/**
 * 상품 '좋아요'를 취소하고, 상품의 likeCount를 1 감소시킵니다.
 * @param {string} userId - 사용자 ID
 * @param {string} productId - 상품 ID
 * @returns  {Promise<object> - 삭제된 ProductLike 객체
 */
export const deleteProductLike = async (userId, productId) => {
  return prisma.$transaction(async (tx) => {
    const deletedLike = await tx.productLike.delete({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });
    const product = await tx.product.update({
      where: { id: productId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
    });

    // return deletedLike;
    return product.likeCount;
  });
};

/**
 * 특정 사용자가 특정 게시글을 좋아하는지 확인합니다.
 * @param {string} userId - 사용자ID
 * @param {string} articleId - 게시글ID
 * @returns {Promise<object|null>} - ArticleLike 객체 또는 null
 */
export const findArticleLike = async (userId, articleId) => {
  return prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });
};

/**
 * 게시글에 '좋아요'를 추가하고, 게시글의 likeCount를 1 증가시킵니다.
 * @param {string} userId - 사용자 ID
 * @param {string} articleId  - 게시글 ID
 * @returns {Promise<object>} - 생성된 ArticleLike 객체
 */

export const createArticleLike = async (userId, articleId) => {
  return prisma.$transaction(async (tx) => {
    const newLike = await tx.articleLike.create({
      data: {
        userId,
        articleId,
      },
    });
    const article = await tx.article.update({
      where: { id: articleId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
      select: { likeCount: true },
    });

    // return newLike;
    return article.likeCount;
  });
};

/**
 * 게시글 '좋아요'를 취소하고, 게시글의 likeCount를 1 감소시킵니다.
 * @param {string} userId - 사용자ID
 * @param {string} articleId - 게시글ID
 * @returns {Promise<object>} - 삭제된 ArticleLike 객체
 */
export const deleteArticleLike = async (userId, articleId) => {
  return prisma.$transaction(async (tx) => {
    const deletedLike = await tx.articleLike.delete({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
    const article = await tx.article.update({
      where: { id: articleId },
      data: {
        likeCount: {
          decrement: 1,
        },
      },
      select: { likeCount: true },
    });

    // return deletedLike;
    return article.likeCount;
  });
};
