import { Prisma } from '@prisma/client';
import { prismaClient } from '../lib/prismaClient';

export const articleRepository = {
  create(data: Prisma.ArticleUncheckedCreateInput) {
    return prismaClient.article.create({ data });
  },

  findById(id: number) {
    return prismaClient.article.findUnique({ where: { id } });
  },

  update(id: number, data: Prisma.ArticleUncheckedUpdateInput) {
    return prismaClient.article.update({ where: { id }, data });
  },

  delete(id: number) {
    return prismaClient.article.delete({ where: { id } });
  },

  findList({ skip, take, orderBy, where }: Prisma.ArticleFindManyArgs) {
    return prismaClient.article.findMany({
      skip,
      take,
      orderBy,
      where,
    });
  },

  count(where?: Prisma.ArticleWhereInput) {
    return prismaClient.article.count({ where });
  },

  isLiked(userId: number, articleId: number) {
    return prismaClient.likeArticle.findFirst({
      where: { userId: userId, articleId: articleId },
    });
  },

  likeArticle(userId: number, articleId: number) {
    return prismaClient.likeArticle.create({ data: { userId, articleId: articleId } });
  },

  dislikeArticle(articleId: number) {
    return prismaClient.likeArticle.delete({
      where: { id: articleId },
    });
  },
};
