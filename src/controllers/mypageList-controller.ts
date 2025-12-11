import { Request, Response } from 'express';
import prisma from '../lib/prismaclient';
import { QueryList } from '../types/express/query.types';

//user가 생성한 product list 확인
export async function getUserCreatedProductsList(req: Request, res: Response) {
  const userId = req.userId;
  const { offset, limit, name, description, orderBy } =
    req.validated as QueryList;

  const productList = await prisma.product.findMany({
    where: {
      userId,
      name: { contains: name },
      description: { contains: description },
    },
    skip: offset,
    take: limit,
    orderBy,
  });

  if (!productList || productList.length === 0)
    return res
      .status(401)
      .json({ message: '사용자가 생성 한 제품 목록을 찾을 수 없습니다' });

  res.status(200).json(productList);
}

//user가 생성한 article list 확인
export async function getUserCreatedArticlesList(req: Request, res: Response) {
  const userId = req.userId;
  const { offset, limit, title, content, orderBy } = req.validated as QueryList;

  const articleList = await prisma.article.findMany({
    where: {
      userId,
      title: { contains: title },
      content: { contains: content },
    },
    skip: offset,
    take: limit,
    orderBy,
  });

  if (!articleList || articleList.length === 0)
    return res
      .status(401)
      .json({ message: '사용자가 생성 한 게시글 목록을 찾을 수 없습니다' });

  res.status(200).json(articleList);
}
