// TODO) Article-Like-Repository: 게시글 좋아요 저장소
// &) Config Import
import prisma from '../config/prisma.js';

export const articleLikeRepo = {
  // ?) 좋아요 조회
  findArticleLike(userId, articleId) {
    return prisma.articleLike.findUnique({
      where: { userId_articleId: { userId, articleId } },
    });
  },

  // ?) 좋아요 등록
  createArticleLike(userId, articleId) {
    return prisma.articleLike.create({ data: { userId, articleId } });
  },

  // ?) 좋아요 취소
  deleteArticleLike(userId, articleId) {
    return prisma.articleLike.delete({
      where: { userId_articleId: { userId, articleId } },
    });
  },

  // ?) 좋아요 목록 조회
  listLikedArticles(userId) {
    return prisma.articleLike.findMany({
      where: { userId },
      select: {
        article: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
          },
        },
      },
    });
  },
};
