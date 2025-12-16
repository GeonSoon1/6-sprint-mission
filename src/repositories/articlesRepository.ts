import { prisma } from '../utils/prisma';
import { Prisma } from '@prisma/client';

const createArticle = async (data: Prisma.ArticleCreateInput) => {
  return prisma.article.create({ data });
};

const findArticles = async (params: Prisma.ArticleFindManyArgs) => {
  return prisma.article.findMany(params);
};

const countArticles = async (where: Prisma.ArticleWhereInput) => {
  return prisma.article.count({ where });
};

const findArticleById = async (id: string, select?: Prisma.ArticleSelect) => {
  return prisma.article.findUniqueOrThrow({
    where: { id },
    select,
  });
};

const updateArticle = async (id: string, data: Prisma.ArticleUpdateInput) => {
  return prisma.article.update({
    where: { id },
    data,
  });
};

const deleteArticle = async (id: string) => {
  return prisma.article.delete({
    where: { id },
  });
};

export const articlesRepository = {
  createArticle,
  findArticles,
  countArticles,
  findArticleById,
  updateArticle,
  deleteArticle,
};
