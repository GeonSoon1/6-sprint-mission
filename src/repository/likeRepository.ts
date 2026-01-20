import prisma from '../lib/prisma';

export type LikeTargetType = 'Product' | 'Article';

class LikeRepository {
  findExistingLike(type: LikeTargetType, userId: number, targetId: number) {
    if (type === 'Product') {
      return prisma.productLike.findFirst({
        where: { userId, productId: targetId },
        select: { id: true },
      });
    }

    return prisma.articleLike.findFirst({
      where: { userId, articleId: targetId },
      select: { id: true },
    });
  }

  async toggleLikeTransaction(
    type: LikeTargetType,
    userId: number,
    targetId: number,
    existingLikeId?: number,
  ) {
    let isLiked = false;

    await prisma.$transaction(async (tx) => {
      if (existingLikeId) {
        // 좋아요 삭제
        if (type === 'Product') {
          await tx.productLike.delete({ where: { id: existingLikeId } });
          await tx.product.update({
            where: { id: targetId },
            data: { likeCount: { decrement: 1 } },
          });
        } else {
          await tx.articleLike.delete({ where: { id: existingLikeId } });
          await tx.article.update({
            where: { id: targetId },
            data: { likeCount: { decrement: 1 } },
          });
        }
      } else {
        // 좋아요 생성
        if (type === 'Product') {
          await tx.productLike.create({
            data: { userId, productId: targetId },
          });
          await tx.product.update({
            where: { id: targetId },
            data: { likeCount: { increment: 1 } },
          });
        } else {
          await tx.articleLike.create({
            data: { userId, articleId: targetId },
          });
          await tx.article.update({
            where: { id: targetId },
            data: { likeCount: { increment: 1 } },
          });
        }

        isLiked = true;
      }
    });

    return isLiked;
  }
}

export default new LikeRepository();
