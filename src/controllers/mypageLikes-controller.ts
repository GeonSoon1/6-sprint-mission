import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';

export async function getUserlikedProductsList(req: Request, res: Response) {
  const userId = req.userId;

  const productLikeDB = await prisma.productLikes.findMany({
    where: { userId },
  });

  const productLikeIds = productLikeDB.map((item) => item.productId);

  let likeProductList = [];

  for (const id of productLikeIds) {
    const product = await prisma.product.findUnique({
      where: { id },
    });
    likeProductList.push(product);
  }

  return res.status(200).json(likeProductList);
}

export async function getUserlikedArticlesList(req: Request, res: Response) {
  const userId = req.userId;

  const articleLikeDB = await prisma.articleLikes.findMany({
    where: { userId },
  });

  const articleLikeIds = articleLikeDB.map((item) => item.articleId);

  let likeArticleList = [];

  for (const id of articleLikeIds) {
    const article = await prisma.article.findUnique({
      where: { id },
    });
    likeArticleList.push(article);
  }

  return res.status(200).json(likeArticleList);
}
