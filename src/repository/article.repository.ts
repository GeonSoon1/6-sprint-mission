import { ArticleCustom } from '../types/express/body.types';
import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';
import {
  CreateArticleCommandDto,
  GetArticlesFinalRequestDto,
  UpdateArticleDto,
} from '../dto/article.dto';

export const articleRepository = {
  async create(data: CreateArticleCommandDto) {
    return prisma.article.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.userId,
      },
    });
  },

  async readList(querySet: GetArticlesFinalRequestDto) {
    const { offset, limit, orderBy, title, content } = querySet;
    return prisma.article.findMany({
      where: {
        title: {
          contains: title,
        },
        content: {
          contains: content,
        },
      },
      skip: offset,
      take: limit,
      orderBy,
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
      },
    });
  },

  async readInfo(articleId: number) {
    return prisma.article.findUniqueOrThrow({
      where: { id: articleId },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        userId: true,
      },
    });
  },

  async readLike(articleId: number, userId: number) {
    return prisma.articleLikes.findUnique({
      where: {
        userId_articleId: {
          userId,
          articleId,
        },
      },
    });
  },

  async update(body: UpdateArticleDto, articleId: number) {
    return prisma.article.update({
      where: { id: articleId },
      data: body,
    });
  },

  async delete(articleId: number) {
    return prisma.article.delete({
      where: { id: articleId },
    });
  },
};
