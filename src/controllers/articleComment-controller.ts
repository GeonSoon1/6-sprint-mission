import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';

export async function createArticleComment(req: Request, res: Response) {
  const userId = req.userId;
  const articleId = req.article.id;

  const { content } = req.body;
  const commentCreate = await prisma.commentArticle.create({
    data: {
      content,
      userId,
      articleId,
    },
    include: {
      article: true,
    },
  });

  res.status(201).json(commentCreate);
}

export async function getArticleCommentsList(req: Request, res: Response) {
  const articleId = req.article.id;

  const articleComments = await prisma.article.findUnique({
    where: { id: articleId },
    include: {
      comments: {
        select: {
          id: true,
          content: true,
          createdAt: true,
        },
      },
    },
  });

  if (!articleComments)
    return res
      .status(404)
      .json({ message: '게시글의 댓글 목록을 찾을 수 없습니다' });

  res.status(200).json(articleComments.comments);
}

export async function updateArticleComment(req: Request, res: Response) {
  const commentId = req.artComment.id;
  const commentUpdate = await prisma.commentArticle.update({
    where: { id: commentId },
    data: req.body,
  });

  res.status(201).json(commentUpdate);
}

export async function deleteArticleComment(req: Request, res: Response) {
  const commentId = req.artComment.id;
  await prisma.commentArticle.delete({
    where: { id: commentId },
  });

  res.status(204).json({ message: '삭제 완료' });
}
