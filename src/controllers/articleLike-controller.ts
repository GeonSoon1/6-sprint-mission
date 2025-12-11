import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';

export async function likeCountUp(req: Request, res: Response) {
  const userId = req.user.id;
  const article = req.article;
  const articleId = article.id;

  // likeCount 증가 작업
  const upArticleLikeCount = article.likeCount + 1;

  const updateArticleLikesCount = await prisma.article.update({
    where: { id: articleId },
    data: { likeCount: Number(upArticleLikeCount) },
  });

  // articleLikes DB에 기록
  const updateArticleLikesDB = await prisma.articleLikes.create({
    data: {
      userId,
      articleId,
    },
  });

  res.status(200).json({ updateArticleLikesCount, updateArticleLikesDB });
}

export async function likeCountDown(req: Request, res: Response) {
  const userId = req.user.id;
  const article = req.article;
  const articleId = article.id;

  // likeCount 감소 작업
  const downArticleLikeCount = article.likeCount - 1;

  const updateArticleLikeCount = await prisma.article.update({
    where: { id: articleId },
    data: { likeCount: Number(downArticleLikeCount) },
  });

  const deleteArtLikeId = req.artLikeId;

  // articleLikes DB에서 삭제
  await prisma.articleLikes.delete({
    where: { id: deleteArtLikeId },
  });

  res.status(200).json({ updateArticleLikeCount });
}
