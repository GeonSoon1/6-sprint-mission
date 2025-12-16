import { User } from '@prisma/client';
import BadRequestError from '../lib/errors/BadRequestError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import NotFoundError from '../lib/errors/NotFoundError';
import UnauthorizeError from '../lib/errors/UnauthorizeError';
import { articleRepository } from '../repository/articleRepository';
import { CreateArticleBodyDTO, GetListArticleParam, UpdateArticleDto } from '../dto/article.dto';

export const articleService = {
  async createArticle(data: CreateArticleBodyDTO, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    return articleRepository.create({
      ...data,
      authorId: user.id,
    });
  },

  async getArticle(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('article', id);
    }

    const isLike = await articleRepository.isLiked(user.id, id);

    return { article, isLike };
  },

  async updateArticle(id: number, data: UpdateArticleDto, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('article', id);
    }
    if (article.authorId !== user.id) {
      throw new ForbiddenError('article');
    }

    return articleRepository.update(id, data);
  },

  async deleteArticle(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }
    const article = await articleRepository.findById(id);
    if (!article) {
      throw new NotFoundError('article', id);
    }
    if (article.authorId !== user.id) {
      throw new ForbiddenError('article');
    }

    return articleRepository.delete(id);
  },

  async getListArticle(params: GetListArticleParam) {
    const { page, pageSize, orderBy, keyword } = params;

    const where = {
      title: keyword ? { contains: keyword } : undefined,
    };

    const totalCount = articleRepository.count(where);
    const list = articleRepository.findList({
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
      where,
    });

    return { list: list, totalCount: totalCount };
  },

  async likeArticle(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }

    const isLike = await articleRepository.isLiked(user.id, id);
    if (isLike) {
      new BadRequestError('Already like article!');
    }

    return articleRepository.likeArticle(user.id, id);
  },

  async dislikeArticle(id: number, user: User | null | undefined) {
    if (!user) {
      throw new UnauthorizeError();
    }

    const likeArticleFind = await articleRepository.isLiked(user.id, id);

    if (likeArticleFind) {
      new BadRequestError('Already dislike article!');
    }
    return articleRepository.dislikeArticle(user.id);
  },
};
