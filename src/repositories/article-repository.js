// TODO) Article-Repository: DB 저장소
// &) Config Import
import prisma from '../config/prisma.js';

export const articleRepo = {
  // ?) 게시글 목록 조회
  findArticles(where, orderBy, offset, limit) {
    return prisma.article.findMany({
      where,
      orderBy,
      skip: offset,
      take: limit,
      select: { id: true, title: true, content: true, createdAt: true },
    });
  },

  // ?) 게시글 단건 조회
  findArticleById(id) {
    return prisma.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        userId: true,
      },
    });
  },

  // ?) 게시글 생성
  createArticle(data) {
    return prisma.article.create({ data });
  },

  // ?) 게시글 수정
  updateArticle(id, data) {
    return prisma.article.update({ where: { id }, data });
  },

  // ?) 게시글 삭제
  deleteArticle(id) {
    return prisma.article.delete({ where: { id } });
  },
};
