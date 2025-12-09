// TODO) Article-Comment-Repository: DB 저장소
// &) Config Import
import prisma from '../config/prisma.js';

export const articleCommentRepo = {
  // ?) 댓글 목록 조회
  findByArticle(articleId) {
    return prisma.articleComment.findMany({
      where: { articleId },
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
  findById(id) {
    return prisma.articleComment.findUnique({
      where: { id },
      select: {
        id: true,
        articleId: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });
  },

  // ?) 댓글 생성
  create(data) {
    return prisma.articleComment.create({ data });
  },

  // ?) 댓글 수정
  update(id, data) {
    return prisma.articleComment.update({
      where: { id },
      data,
    });
  },

  // ?) 댓글 삭제
  remove(id) {
    return prisma.articleComment.delete({
      where: { id },
    });
  },
};
