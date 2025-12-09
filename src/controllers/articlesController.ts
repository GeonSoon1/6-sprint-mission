import { create } from 'superstruct';
import { prismaClient } from '../lib/prismaClient';
import NotFoundError from '../lib/errors/NotFoundError';
import ForbiddenError from '../lib/errors/ForbiddenError';
import { IdParamsStruct } from '../structs/commonStructs';
import {
  CreateArticleBodyStruct,
  UpdateArticleBodyStruct,
  GetArticleListParamsStruct,
} from '../structs/articlesStructs';
import { CreateCommentBodyStruct, GetCommentListParamsStruct } from '../structs/commentsStruct';
import { Request, Response } from 'express';
import UnauthorizeError from '../lib/errors/UnauthorizeError';

export async function createArticle(req: Request, res: Response) {
  const data = create(req.body, CreateArticleBodyStruct);
  const user = req.user;

  if (!user) {
    throw new UnauthorizeError();
  }

  const article = await prismaClient.article.create({ data: { ...data, authorId: user.id } });

  return res.status(201).send({ message: 'article 생성됨', article });
}

export async function getArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  const isLiked = await prismaClient.likeArticle.findFirst({
    where: { userId: user.id, articleId: id },
  });

  return res.send({ article: article, isLike: Boolean(isLiked) });
}

export async function updateArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const data = create(req.body, UpdateArticleBodyStruct);
  const user = req.user;

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  if (article.authorId !== user.id) {
    throw new ForbiddenError('article');
  }

  const updateArticle = await prismaClient.article.update({ where: { id }, data });

  return res.send({ message: 'article 수정됨', updateArticle });
}

export async function deleteArticle(req: Request, res: Response) {
  const { id } = create(req.params, IdParamsStruct);
  const user = req.user;

  const article = await prismaClient.article.findUnique({ where: { id } });
  if (!article) {
    throw new NotFoundError('article', id);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  if (article.authorId !== user.id) {
    throw new ForbiddenError('article');
  }

  await prismaClient.article.delete({ where: { id } });

  return res.status(204).send({ message: 'article 삭제됨' });
}

export async function getArticleList(req: Request, res: Response) {
  const { page, pageSize, orderBy, keyword } = create(req.query, GetArticleListParamsStruct);

  const where = {
    title: keyword ? { contains: keyword } : undefined,
  };

  const totalCount = await prismaClient.article.count({ where });
  const articles = await prismaClient.article.findMany({
    skip: (page - 1) * pageSize,
    take: pageSize,
    orderBy: orderBy === 'recent' ? { createdAt: 'desc' } : { id: 'asc' },
    where,
  });

  return res.send({
    list: articles,
    totalCount,
  });
}

export async function createComment(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { content } = create(req.body, CreateCommentBodyStruct);
  const user = req.user;

  const existingArticle = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!existingArticle) {
    throw new NotFoundError('article', articleId);
  }

  if (!user) {
    throw new UnauthorizeError();
  }

  const comment = await prismaClient.comment.create({
    data: {
      articleId,
      content,
      authorId: user.id,
    },
  });

  return res.status(201).send(comment);
}

export async function getCommentList(req: Request, res: Response) {
  const { id: articleId } = create(req.params, IdParamsStruct);
  const { cursor, limit } = create(req.query, GetCommentListParamsStruct);

  const article = await prismaClient.article.findUnique({ where: { id: articleId } });
  if (!article) {
    throw new NotFoundError('article', articleId);
  }

  const commentsWithCursor = await prismaClient.comment.findMany({
    cursor: cursor ? { id: cursor } : undefined,
    take: limit + 1,
    where: { articleId },
    orderBy: { createdAt: 'desc' },
  });
  const comments = commentsWithCursor.slice(0, limit);
  const cursorComment = commentsWithCursor[commentsWithCursor.length - 1];
  const nextCursor = cursorComment ? cursorComment.id : null;

  return res.send({
    list: comments,
    nextCursor,
  });
}

export async function likeArticle(req: Request, res: Response) {
  try {
    const { id } = create(req.params, IdParamsStruct);

    if (!req.user) {
      throw new UnauthorizeError();
    }

    const userId = req.user.id;

    const like = await prismaClient.likeArticle.create({ data: { userId, articleId: id } });
    res.status(200).send({ message: 'Like!', like });
  } catch (err) {
    return res.status(400).send('already liked Article!');
  }
}

export async function dislikeArticle(req: Request, res: Response) {
  try {
    const { id } = create(req.params, IdParamsStruct);

    if (!req.user) {
      throw new UnauthorizeError();
    }
    const userId = req.user.id;

    const likeArticleFind = await prismaClient.likeArticle.findFirst({
      where: { articleId: id, userId: userId },
    });

    //이부분 질문 필요
    if (!likeArticleFind) {
      throw new NotFoundError('no liked Article', likeArticleFind!.id);
    }

    const dislikeArticle = await prismaClient.likeArticle.delete({
      where: { id: likeArticleFind.id },
    });

    res.status(200).send({ message: 'Dislike!', dislikeArticle });
  } catch (err) {
    return res.status(400).send('already disliked Article');
  }
}
