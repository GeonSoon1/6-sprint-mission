import { prisma } from '../utils/prisma';

async function changeProductLike(productId, userId) {
  const likeCheck = await prisma.productLike.findUnique({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
  });

  if (likeCheck) {
    await prisma.productLike.delete({
      where: { id: likeCheck.id },
    });
    return { isLiked: false, message: '좋아요를 취소했습니다.' };
  } else {
    await prisma.productLike.create({
      data: { userId, productId },
    });
    return { isLiked: true, message: '좋아요를 눌렀습니다.' };
  }
}

async function changeArticleLike(articleId, userId) {
  const likeCheck = await prisma.articleLike.findUnique({
    where: {
      userId_articleId: {
        userId,
        articleId,
      },
    },
  });

  if (likeCheck) {
    await prisma.articleLike.delete({
      where: { id: likeCheck.id },
    });
    return { isLiked: false, message: '좋아요를 취소했습니다.' };
  } else {
    await prisma.articleLike.create({
      data: { userId, articleId },
    });
    return { isLiked: true, message: '좋아요를 눌렀습니다.' };
  }
}

export const likesService = {
  changeProductLike,
  changeArticleLike,
};
